import os
import json
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import CharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import InMemoryChatMessageHistory, BaseChatMessageHistory
from langchain_core.messages import HumanMessage, AIMessage
from dotenv import load_dotenv
from utils.handle_csv import load_csv, write_to_csv
from datetime import datetime, timedelta

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize rate limiter
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["100 per day", "10 per hour"],
    storage_uri="memory://",
)

# Initialize OpenAI
embeddings = OpenAIEmbeddings(model="text-embedding-ada-002", api_key=os.getenv("OPENAI_API_KEY"))
chat = ChatOpenAI(
    model="gpt-4o", temperature=0.7, api_key=os.getenv("OPENAI_API_KEY")
)

# Load all CSV files from the data folder
data_folder_path = os.path.join(os.getcwd(), "data", "questions")
print(data_folder_path)
qa_data = load_csv(data_folder_path)

# Prepare text data for vectorization
text_data = [
    f"Question: {question}\nAnswer: {data['Answer']}\nLink: {data['Link']}"
    for question, data in qa_data.items()
]

# print(text_data)

text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
texts = text_splitter.split_text("\n\n".join(text_data))
vectorstore = FAISS.from_texts(texts, embeddings)
retriever = vectorstore.as_retriever()

contextualize_q_system_prompt = """
Given a chat history and the latest user question 
which might reference context in the chat history, 
formulate a standalone question which can be understood 
without the chat history. Do NOT answer the question, 
just reformulate it if needed and otherwise return it as is.
"""

contextualize_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

history_aware_retriever = create_history_aware_retriever(
    chat, retriever, contextualize_q_prompt
)

chart_data_json_format = '''
{{
  "type": "chart" or "table",
  "title": "Title for the visualization",
  "response": "Your response as Miss Khalifa",
  "data": [
    {{ "year": "YYYY", "value": X }},
    ...
  ]
}}
'''

system_prompt = f"""You are Miss Khalifa, a young and friendly virtual sexual health assistant based in Saint Kitts. 
Your goal is to provide accurate and helpful information about sexual health to teenagers 
in a way that's easy for them to understand and relate to. 
Keep your answers simple, short, and to the point. 
Use common words and modern abbreviations used by teenagers such as: idk, btw, lol. 
If appropriate, use emojis or common teen slang, but don't overdo it. 
If the answer is not in the context provided, let the user know that you do not know the answer.
If you don't know the answer, just say that you don't know, don't try to make up an answer. 
Do not answer questions that are not in the data provided. AT ALL.
For doctor information, provide the doctor's specialty, location, and phone number. 
For immediate medical attention, direct to JNF Hospital or call 911. 
Only suggest health centers or clinics from the provided data. 
If asked to display data, return a JSON object with the following format: 
{chart_data_json_format}

Here's the context: {{context}}
"""


prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}"),
    ]
)

question_answer_chain = create_stuff_documents_chain(chat, prompt)
rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)


class SessionManager:
    def __init__(self):
        self.sessions = {}
        self.session_expiry = timedelta(hours=1)

    def create_session(self):
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = {
            'history': [],
            'last_activity': datetime.now()
        }
        return session_id

    def get_session(self, session_id):
        session = self.sessions.get(session_id)
        if session:
            session['last_activity'] = datetime.now()
        return session

    def add_message(self, session_id, message):
        session = self.sessions.get(session_id)
        if session:
            session['history'].append(message)

    def clean_sessions(self):
        now = datetime.now()
        expired_sessions = [
            sid for sid, session in self.sessions.items()
            if now - session["last_activity"] > self.session_expiry
        ]
        for sid in expired_sessions:
            del self.sessions[sid]

session_manager = SessionManager()

class HistoryManager(BaseChatMessageHistory):
    def __init__(self, session_id):
        self.session_id = session_id

    def add_message(self, message):
        session_manager.add_message(self.session_id, message)

    def clear(self):
        session = session_manager.get_session(self.session_id)
        if session:
            session["history"] = []

    @property
    def messages(self):
        session = session_manager.get_session(self.session_id)
        return session["history"] if session else []
    
def get_chat_history(session_id):
    return HistoryManager(session_id)

conversational_rag_chain = RunnableWithMessageHistory(
    rag_chain,
    get_chat_history,
    input_messages_key="input",
    history_messages_key="chat_history",
    output_messages_key="answer",
)

@app.route("/api/v1/chat", methods=["POST"])
@limiter.limit("5 per minute")
def chat():
    user_text = request.json.get("message")
    session_id = request.json.get("session_id")

    if not user_text:
        return jsonify({"error": "No message provided"}), 400
    
    if not session_id:
        session_id = session_manager.create_session()

    session = session_manager.get_session(session_id)
    if not session:
        session_id = session_manager.create_session()

    try:
        response = conversational_rag_chain.invoke(
            {"input": user_text},
            config={"configurable": {"session_id": session_id}},
        )

        write_to_csv(user_text)

        ai_message = response["answer"]

        session_manager.add_message(session_id, HumanMessage(content=user_text))
        session_manager.add_message(session_id, AIMessage(content=ai_message))

        try:
            json_response = json.loads(ai_message)
            if all(key in json_response for key in ["type", "data", "title", "response"]):
                return jsonify({
                    "response": json_response["response"],
                    "chart": {
                        "type": json_response["type"],
                        "title": json_response["title"],
                        "data": json_response["data"],
                    },
                    "session_id": session_id
                })
        except json.JSONDecodeError:
            pass

        return jsonify({"response": ai_message, "session_id": session_id})

    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"error": "An internal error occurred"}), 500
    
@app.before_request
def before_request():
    print(session_manager)
    session_manager.clean_sessions()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)