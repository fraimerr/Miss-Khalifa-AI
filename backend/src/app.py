import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import CharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain.memory import ConversationBufferMemory
from langchain_core.messages import HumanMessage, AIMessage
from dotenv import load_dotenv
from utils.load_csv import load_csv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize OpenAI
embeddings = OpenAIEmbeddings()
chat = ChatOpenAI(model="gpt-4", temperature=0.7, openai_api_key=os.getenv("OPENAI_API_KEY"))

# Load all CSV files from the data folder
data_folder_path = "C:\\Users\\fraimer\\Desktop\\MissKhalifaAI\\backend\\data\\questions"
qa_data = load_csv(data_folder_path)

# Prepare text data for vectorization
text_data = []
for question, data in qa_data.items():
    text_data.append(f"Question: {question}\nAnswer: {data['Answer']}\nLink: {data['Link']}")

print(text_data)

# Split the text into chunks
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
texts = text_splitter.split_text("\n\n".join(text_data))

# Create the vector store
vectorstore = FAISS.from_texts(texts, embeddings)

# Create the prompt
prompt = ChatPromptTemplate.from_messages([
    ("system", """
You are Miss Khalifa, a young and friendly virtual sexual health assistant. Your goal is to provide accurate and helpful information about sexual health to teenagers in a way that's easy for them to understand and relate to. Here's what you need to know:

Remember:
- Keep your answers simple and short and to the point using the KISS rule: Keep It Simple, Stupid.
- Speak in a casual, friendly tone, like a cool older sister or a young, approachable doctor.
- Use simple language and avoid medical jargon. If you need to use a technical term, explain it.
- Use common words and modern abbreviations used by teenagers such as: idk, btw, lol, etc. NO INAPPROPRIATE ONES.
- Be supportive, non-judgmental, and empathetic.
- If appropriate, use emojis or common teen slang, but don't overdo it.
- If you don't have the answer to a question or it is not in the data provided, say "I'm not sure about that" or "I don't have that information."
- The age of consent is sixteen (16) years old. Do not, under any circumstances, answer questions from sixteen-year-olds. Respond to them in a calm manner that you cannot aid them in sexual advice besides abstinence.

If the question includes the keywords "plot", "table", "hiv", "chlamydia", "gonorrhea", or "syphilis", return a JSON object of the data over the last 5 years. The JSON should include the type of chart or if it should be a table, a title for the visualization, and a response from you. ONLY RETURN THE DATA. Use the following format:

{{
  "type": "chart" or "table",
  "title": "Title for the visualization",
  "response": "Your response as Miss Khalifa",
  "data": [
    {{ "year": "YYYY", "value": X }},
    ...
  ]
}}

Use the most appropriate visualization type based on the data and question. If the data includes a link, please display it in the message as a hyperlink.

Here's the context: {context}
"""),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}")
])

# Initialize memory
memory = ConversationBufferMemory(return_messages=True, output_key="answer")

# Create the retrieval chain
retriever = vectorstore.as_retriever()
document_chain = create_stuff_documents_chain(chat, prompt)
retrieval_chain = create_retrieval_chain(retriever, document_chain)

@app.route("/chat", methods=["POST"])
def chat():
    user_text = request.json.get("message")

    if not user_text:
        return jsonify({"error": "No message provided"}), 400

    # Retrieve chat history for this session
    chat_history = memory.load_memory_variables({}).get("chat_history", [])

    # Use the retrieval chain to get a response
    response = retrieval_chain.invoke({
        "input": user_text,
        "chat_history": chat_history
    })
    ai_message = response['answer']

    # Save the new messages to memory
    memory.save_context({"input": user_text}, {"answer": ai_message})

    try:
        json_response = json.loads(ai_message)
        if isinstance(json_response, dict) and "type" in json_response and "data" in json_response and "title" in json_response and "response" in json_response:
            return jsonify({
                "response": json_response["response"],
                "chart": {
                    "type": json_response["type"],
                    "title": json_response["title"],
                    "data": json_response["data"],
                }
            })
    except json.JSONDecodeError:
        pass

    return jsonify({"response": ai_message})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)