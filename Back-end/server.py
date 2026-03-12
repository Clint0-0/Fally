from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Word categories
SLURS_SEVERE = [
    "subhuman", "supremacy"
]

HATE_TERMS = [
    "hate you", "kill yourself", "kys", "go die"
]

HARASSMENT = [
    "idiot", "moron", "stupid", "dumb", "loser",
    "pathetic", "ugly", "freak", "weirdo"
]

PROFANITY = [
    "damn", "hell", "crap", "bastard"
]

def detect_toxicity(text):

    text = text.lower()

    for word in SLURS_SEVERE:
        if word in text:
            return "severe"

    for word in HATE_TERMS:
        if word in text:
            return "hate"

    for word in HARASSMENT:
        if word in text:
            return "harassment"

    for word in PROFANITY:
        if word in text:
            return "profanity"

    return "clean"


@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.json
    text = data.get("text", "")

    severity = detect_toxicity(text)

    return jsonify({
        "severity": severity
    })


if __name__ == "__main__":
    app.run(port=5000, debug=True)