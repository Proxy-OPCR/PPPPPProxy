import random

class SimpleAI:
    def __init__(self):
        self.responses = {
            "こんにちは": ["こんにちは！", "やあ、元気ですか？"],
            "お元気": ["はい、元気です！", "まあまあです"]
        }

    def respond(self, text):
        for key, replies in self.responses.items():
            if key in text:
                return random.choice(replies)
        return "すみません、お答えできません。"
