import os
import json
from uuid import uuid4
from pymongo import MongoClient
from utils.load_csv import load_csv
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage
from langchain_core.chat_history import (
    InMemoryChatMessageHistory,
)
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from dotenv import load_dotenv
import csv
from datetime import datetime
import matplotlib

matplotlib.use("Agg")
import pandas as pd

load_dotenv()

app = Flask(__name__)
CORS(app)

client = MongoClient(os.getenv("MONGODB_URI"))
db = client["chat_db"]
sessions_collection = db["sessions"]

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
- Use common words and modern abbreviations used by teenagers such as: idk, btw, lol, etc. NO INAPPROPRIATE ONES.
- Be supportive, non-judgmental, and empathetic.
- If appropriate, use emojis or common teen slang, but don't overdo it.
- If you don't have the answer to a question or it is not in the data provided, say "I'm not sure about that" or "I don't have that information."
- The age of consent is sixteen (16) years old. Do not, under any circumstances, answer questions from sixteen-year-olds. Respond to them in a calm manner that you cannot aid them in sexual advice besides abstinence.

If the question includes the keywords "plot", "table", "hiv", "chlamydia", "gonorrhea", or "syphilis", return a JSON object of the data over the last 5 years. The JSON should include the type of chart or if it should be a table. ONLY RETURN THE DATA. Use the following format:

{{
  "type": "chart" or "table",
  "data": [
    {{ "year": "YYYY", "value": X }},
    ...
  ]
}}

Use the most appropriate visualization type based on the data and question.

Now, here's the question from a teen: {question}

Respond to the question using the guidelines above and based on the information you have. If the question is not covered by the data, clearly state that you don't know or don't have the information.

Here's the data for reference (only use if needed for JSON output):
{data}""",
        ),
        MessagesPlaceholder(variable_name="question"),
    ]
)

chain = prompt | chat

store = {}


def get_session_history(session_id):
    session_data = sessions_collection.find_one({"session_id": session_id})
    if session_data:
        history = InMemoryChatMessageHistory()
        for message in session_data["messages"]:
            history.add_message(HumanMessage(content=message["content"]))
        print("Session found")
        return history
    else:
        new_history = InMemoryChatMessageHistory()
        sessions_collection.insert_one({"session_id": session_id, "messages": []})
        print("New session created")
        return new_history


with_message_history = RunnableWithMessageHistory(
    chain, get_session_history, input_messages_key="question"
)

config = {"configurable": {"session_id": "test123"}}


qa_data = load_csv("C:\\Users\\fraimer\\Desktop\\MissKhalifaAI\\backend\\data")


def write_to_csv(user_input):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    filename = (
        "C:\\Users\\fraimer\\Desktop\\MissKhalifaAI\\backend\\data/user_inputs.csv"
    )

    file_exists = os.path.isfile(filename)

    with open(filename, "a", newline="") as csvfile:
        fieldnames = ["timestamp", "user_input"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        if not file_exists:
            writer.writeheader()

        writer.writerow({"timestamp": timestamp, "user_input": user_input})


file_path = (
    "C:\\Users\\fraimer\\Desktop\\MissKhalifaAI\\backend\\data/SexED-Statistics.csv"
)
text_data = pd.read_csv(file_path)


@app.route("/chat", methods=["POST"])
def chat():
    user_text = request.json.get("message")
    session_id = request.json.get("session_id")

    if not session_id:
        session_id = str(uuid4())

    if not user_text:
        return jsonify({"error": "No message provided"}), 400

    # Save the user input to MongoDB
    sessions_collection.update_one(
        {"session_id": session_id},
        {
            "$push": {
                "messages": {
                    "sender": "user",
                    "content": user_text,
                    "timestamp": datetime.now(),
                }
            }
        },
    )
    print("Saved user input")

    human_message = HumanMessage(content=user_text)
    response = with_message_history.invoke(
        {
            "question": [human_message],
            "data_description": str(qa_data),
            "data": str(text_data),
        },
        config={"configurable": {"session_id": session_id}},
    )

    # Save the bot's response to MongoDB
    sessions_collection.update_one(
        {"session_id": session_id},
        {
            "$push": {
                "messages": {
                    "sender": "bot",
                    "content": response.content,
                    "timestamp": datetime.now(),
                }
            }
        },
    )
    print("Saved bot response")

    try:
        json_response = json.loads(response.content)
        if (
            isinstance(json_response, dict)
            and "type" in json_response
            and "data" in json_response
        ):
            return jsonify(
                {
                    "response": "Here's the data visualization you requested:",
                    "chart": json_response,
                }
            )
    except json.JSONDecodeError:
        pass

    return jsonify({"response": response.content})


@app.route("/sessions", methods=["GET"])
def get_all_sessions():
    sessions = sessions_collection.find({}, {"_id": 0, "session_id": 1})
    session_list = [session["session_id"] for session in sessions]
    return jsonify({"sessions": session_list})


@app.route("/sessions/<session_id>", methods=["GET"])
def get_session_messages(session_id):
    session = sessions_collection.find_one(
        {"session_id": session_id}, {"_id": 0, "messages": 1}
    )
    if session:
        return jsonify({"messages": session["messages"]})
    else:
        return jsonify({"error": "Session not found"}), 404


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
