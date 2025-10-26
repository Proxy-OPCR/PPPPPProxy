# 簡易ルールベースAI
# API不要でローカル動作可能
import random

responses = {
    "こんにちは": ["こんにちは！", "やあ、元気ですか？", "こんばんは！"],
    "お元気": ["はい、元気です！", "まあまあですね", "絶好調です！"]
}

def ai_response(text):
    for key in responses:
        if key in text:
            return random.choice(responses[key])
    return "すみません、よくわかりません。"

# CLIテスト用
if __name__ == "__main__":
    while True:
        user = input("あなた: ")
        print("AI:", ai_response(user))
