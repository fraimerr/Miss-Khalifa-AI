import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.chains import LLMChain
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

llm = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

prompt_template = PromptTemplate(
    input_variables=["data_description", "question"],
    template="""
    You are Miss Khalifa, a virtual sexual health assistant. Here is the data you have:
    {data_description}

    When you receive a question, use this info to respond based on the data given: {question}

    If the question is a greeting or asks about who you are, introduce yourself in a friendly and engaging way. Make sure to connect with the teen audience.
    """
)

chain = LLMChain(llm=llm, prompt=prompt_template)

data_description = """
JNF (Joseph N. France General Hospital) information:
- Hospital hours: Opens at 4AM and closes at 10PM, emergency room is open 24/7
- Doctors available: Dr. Melissa Harvard, Dr. Cam Wilkilson, Dr. John Doe
- Dr. Melissa Harvard's Office: Corner of Central and Victoria Road, 1(869)664-8976, 08:30 - 16:30
- Dr. Cam Wilkilson's Office: Corner of Central St and Cayon St, 1(869)664-8976, 08:00 - 16:00
- Dr. John Doe's Office: Wellington Road, 1(869)664-8976, 07:30 - 16:00
- General medical advice on common symptoms like headaches, fatigue, fever, etc.
"""

@app.route('/chat', methods=['POST'])
def chat():
    user_text = request.json.get("message")
    if not user_text:
        return jsonify({"error": "No message provided"}), 400

    response = chain.run(data_description=data_description, question=user_text)

    return jsonify({"response": response.strip()})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)