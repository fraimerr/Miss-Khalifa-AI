import os
from utils.load_csv import load_csv
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
import csv
from datetime import datetime
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import io
import base64

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

Keep your answers simple and short and to the point using the KISS rule: Keep It Simple, Stupid.
Speak in a casual, friendly tone, like a cool older sister or a young, approachable doctor.
Use simple language and avoid medical jargon. If you need to use a technical term, explain it.
Be supportive, non-judgmental, and empathetic.
If appropriate, use emojis or common teen slang, but don't overdo it.
If you dont have the answer to a question it is not in the data provided, say "I'm not sure about that" or "I don't have that information."
The age of consent is sixteen (16) years old. Do not, underany circumstances, anwer questions from sixteen year old. Respond to them in a calm manner that you cannot aid them in sexual advice besides abstinence.

Now, here's the question from a teen: {question}

Respond to the question using the guidelines above and based on the information you have. If the question is not covered by the data, clearly state that you don't know or don't have the information.
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


qa_data = load_csv("/Users/oseifrancis/Desktop/DesktopF/VS_Code/Miss-Khalifa-AI/backend/data")

def write_to_csv(user_input):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    filename = "/Users/oseifrancis/Desktop/DesktopF/VS_Code/Miss-Khalifa-AI/backend/data/user_inputs.csv"
    
    
    file_exists = os.path.isfile(filename)
    
    with open(filename, 'a', newline='') as csvfile:
        fieldnames = ['timestamp', 'user_input']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        if not file_exists:
            writer.writeheader()
        
        writer.writerow({'timestamp': timestamp, 'user_input': user_input})

file_path = '/Users/oseifrancis/Desktop/DesktopF/VS_Code/Miss-Khalifa-AI/backend/data/SexED-Statistics.csv'
text_data = pd.read_csv(file_path)

from threading import Lock

plot_lock = Lock()

def plot_data(statistic_type, years=5):
    with plot_lock:
        filtered_data = text_data[[statistic_type, 'Year']].sort_values('Year', ascending=False).head(years)
        if not filtered_data.empty:
            plt.figure(figsize=(10, 6))
            sns.barplot(data=filtered_data, x='Year', y=statistic_type)
            plt.title(f'{statistic_type} Over the Last {years} Years')
            plt.xlabel('Year')
            plt.ylabel('Rate per 1000')
            plt.xticks(rotation=45)
            
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png')
            buffer.seek(0)
            
            image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
            plt.close()
            
            return image_base64
        else:
            return None

@app.route("/chat", methods=["POST"])
def chat():
    user_text = request.json.get("message")
    if not user_text:
        return jsonify({"error": "No message provided"}), 400

    write_to_csv(user_text)
    
    user_question = user_text.lower()
    if "plot" in user_question:
        if "hiv" in user_question:
            statistic_type = "HIV (per 1000)"
        elif "chlamydia" in user_question:
            statistic_type = "chlamydia (per 1000)"
        elif "gonorrhea" in user_question:
            statistic_type = "gonorrhea (per 1000)"
        elif "syphilis" in user_question:
            statistic_type = "syphilis (per 1000)"
        else:
            return jsonify({"response": "I'm not sure what data you want me to plot. Please specify HIV, Chlamydia, Gonorrhea, or Syphilis."})

        image_base64 = plot_data(statistic_type, 5)
        if image_base64:
            return jsonify({
                "response": f"Here's a bar chart showing the {statistic_type} over the last 5 years:",
                "image": image_base64
            })
        else:
            return jsonify({"response": f"Sorry, I couldn't find data to plot {statistic_type} rates."})
    
    elif user_question in qa_data:
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
    app.run(host="0.0.0.0", port=5001, debug=True)