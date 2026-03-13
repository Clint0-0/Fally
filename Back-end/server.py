from flask import Flask, request, jsonify
from flask_cors import CORS
from detoxify import Detoxify

app = Flask(__name__)
CORS(app)

# Load Detoxify model
model = Detoxify('multilingual')

# -------------------------
# HARMFUL WORD LIST
# -------------------------

HARMFUL_KEYWORDS = [
    "die",
    "go die",
    "kill yourself",
    "kys",
    "drop dead",
    "hang yourself",
    "suicide",
    "end your life",
    "go kill yourself"
]


# -------------------------
# TOXICITY DETECTION
# -------------------------

def detect_toxicity(text):

    lower = text.lower()

    # Keyword detection
    for word in HARMFUL_KEYWORDS:
        if word in lower:
            return "severe"

    # Detoxify AI detection
    results = model.predict(text)

    toxicity = results["toxicity"]
    severe = results["severe_toxicity"]
    insult = results["insult"]
    threat = results["threat"]
    obscene = results["obscene"]

    if severe > 0.6 or threat > 0.6:
        return "severe"

    elif toxicity > 0.55:
        return "hate"

    elif insult > 0.35:
        return "harassment"

    elif obscene > 0.55:
        return "profanity"

    else:
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