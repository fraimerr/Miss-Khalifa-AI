from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import re

app = Flask(__name__)
CORS(app)

botresponses = {
    r'\bhi\b': ['Hi! I am Miss Kahlifa. The professional chatbot for JNF. How can I help you today?', 'Hey! I\'m Gideon, your virtual JNF assistant. What can I do for you today?'],
    r'\bheadache\b': ["You could be experiencing a Migraine. I recommend drinking water and resting in a dark, quiet room."],
    r'\btired\b': ["You might be experiencing fatigue. Try drinking some milk, eating a nutritious meal, and taking a short nap."],
    r'\bsick\b': ["I'm here to help. Can you tell me the three main symptoms you're experiencing?"],
    r'\bheart\b': ["A rapid heart rate can be serious. If you think you are having a heart attack, head to the Emergency Room immediately!"],
    r'\bhours\b': ["JNF opens at 4AM and closes at 10PM, however, the emergency room is opened 24/7"],
    r'\bopen\b': ["JNF opens at 4AM and closes at 10PM, however, the emergency room is opened 24/7"],
    r'\bclose\b': ["JNF opens at 4AM and closes at 10PM, however, the emergency room is opened 24/7"],
    r'\bfever\b': ["Oh dear, you can treat your fever with water and a full night of rest."],
    r'\bpressure\b': ["You may have high blood pressure. I suggest you go to your doctor who will examine you and give you a prescribed pill if needed."],
    r'\bdoctors\b': ["There are many doctors that are available: Dr. Melissa Harvad, Dr. Cam Wilkilson, Dr. John Doe"],
    r'\bharvard\b': ["Dr. Melissa Harvard's Office is located on the Corner of Central and Victoria Road. Office numbers are 1(869)664-8976. Opening hours are 08:30 - 16:30."],
    r'\bwilkilson\b': ["Dr. Cam Wilkilson's Office is located on the Corner of Central St and Cayon St. Office numbers are 1(869)664-8976. Opening hours are 08:00 - 16:00."],
    r'\bdoe\b': ["Dr. John Doe's Office is located on Wellington Road. Office numbers are 1(869)664-8976. Opening hours are 07:30 - 16:00."],
    r'\btreatment\b': ["You can get treatment from many places. Firstly, you can go to the JNF hospital during opening hours or you can speak to the many doctors available within Basseterre."],
    r'\bhello\b': ["Hi! I am Gideon. The professional chatbot for JNF. How can I help you today?', 'Hey! I'm Gideon, your virtual JNF assistant. What can I do for you today?"],
    r'\bfeet\b': ["I'm sorry to hear that you're experiencing foot pain. Foot pain can arise from a variety of causes, including: Injuries, Overuse or repetitive stress, or Medical conditions. To help alleviate the pain, you might consider getting treatment."],
    r'\bthank\b': ["No problem. Return anytime!"],
    r'\bthanks\b': ["No problem. Return anytime!"],
}

@app.route('/chat', methods=['POST'])
def chat():
    user_text = request.json.get("message")
    if not user_text:
        return jsonify({"error": "No message provided"}), 400

    response_found = False
    for pattern, responses in botresponses.items():
        if re.search(pattern, user_text, re.IGNORECASE):
            response = random.choice(responses)
            response_found = True
            break

    if not response_found:
        response = "Sorry, I didn't quite get that."

    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
