from flask import Flask, request, jsonify
from flask_cors import CORS
from detoxify import Detoxify

app = Flask(__name__)
CORS(app)

# Load Detoxify model once (important for performance)
model = Detoxify('original')


def detect_toxicity(text):

    results = model.predict(text)

    toxicity = results["toxicity"]
    severe = results["severe_toxicity"]
    insult = results["insult"]
    threat = results["threat"]
    obscene = results["obscene"]

    # Decide severity level
    if severe > 0.7 or threat > 0.7:
        return "severe"

    elif toxicity > 0.6:
        return "hate"

    elif insult > 0.35:
        return "harassment"

    elif obscene > 0.6:
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