from flask import Flask, request
from ai_model import SimpleAI

app = Flask(__name__)
ai = SimpleAI()

@app.route("/ai", methods=["GET"])
def ai_response():
    text = request.args.get("text")
    if not text:
        return "テキストが必要です"
    response = ai.respond(text)
    return response

if __name__ == "__main__":
    app.run(port=5000)
