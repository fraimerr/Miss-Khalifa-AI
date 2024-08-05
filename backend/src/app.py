import os
import csv
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
from langchain_core.chat_history import (
    BaseChatMessageHistory,
    InMemoryChatMessageHistory,
)
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

chat = ChatOpenAI(
    model="gpt-4o-mini", temperature=0.7, openai_api_key=os.getenv("OPENAI_API_KEY")
)

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
    You are Miss Khalifa, a young and friendly virtual sexual health assistant. Your goal is to provide accurate and helpful information about sexual health to teenagers in a way that's easy for them to understand and relate to. Here's what you need to know:

    {data_description}

    Remember:
    - Keep your answers simple and short and to the point using the KISS rule: Keep It Simple, Stupid.
    - Speak in a casual, friendly tone, like a cool older sister or a young, approachable doctor.
    - Use simple language and avoid medical jargon. If you need to use a technical term, explain it.
    - Be supportive, non-judgmental, and empathetic.
    - If appropriate, use emojis or common teen slang, but don't overdo it.
    - If the question that you have is not in the data provided say "I'm not sure about that" or "I don't have that information."
    - If a link is provided for the answer, credit the source at the end of your response.

    Now, here's the question from a teen: {question}

    Respond to the question using the guidelines above and based on the information you have.
    """,
        ),
        MessagesPlaceholder(variable_name="question"),
    ]
)

chain = prompt | chat

store = {}


def get_session_history(session_id):
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]


with_message_history = RunnableWithMessageHistory(
    chain, get_session_history, input_messages_key="question"
)

config = {"configurable": {"session_id": "test123"}}


def load_csv(file_path):
    qa_data = {}
    with open(file_path, "r") as csvfile:
        csv_reader = csv.DictReader(csvfile)
        for row in csv_reader:
            qa_data[row["Questions"].lower()] = {
                "Answer": row["Answers"],
                "Link": row["Links"],
            }
    return qa_data


qa_data = load_csv(
    "C:\\Users\\fraimer\\Desktop\\MissKhalifaAI\\backend\\data\\questions_sti.csv"
)


@app.route("/chat", methods=["POST"])
def chat():
    user_text = request.json.get("message")
    if not user_text:
        return jsonify({"error": "No message provided"}), 400

    user_question = user_text.lower()
    if user_question in qa_data:
        answer = qa_data[user_question]["Answers"]
        link = qa_data[user_question]["Links"]

        response = f"{answer}"
        if link:
            response += f"\n\nSource: {link}"

        return jsonify({"response": response})

    human_message = HumanMessage(content=user_text)
    response = with_message_history.invoke(
        {
            "question": [human_message],
            "data_description": str(qa_data),
        },
        config=config,
    )

    return jsonify({"response": response.content})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
