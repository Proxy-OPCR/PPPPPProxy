# APIなし・ローカルAI
import random
import os
import json

# 簡易GPT風構造
class SimpleAI:
    def __init__(self, model_path="model_data/knowledge.json"):
        self.knowledge = {}
        if os.path.exists(model_path):
            with open(model_path, 'r', encoding='utf-8') as f:
                self.knowledge = json.load(f)
        else:
            self.knowledge = {
                "こんにちは": ["こんにちは！", "やあ、元気ですか？", "こんばんは！"],
                "お元気": ["はい、元気です！", "まあまあです", "絶好調です！"],
                "AI": ["私はローカルAIです。", "AIモジュールです。"]
            }

    def respond(self, text):
        # キーワードマッチ＋ランダム応答
        for key, responses in self.knowledge.items():
            if key in text:
                return random.choice(responses)
        # 未知ワードは生成風に返す
        return f"なるほど、「{text}」ですね。もう少し教えてもらえますか？"
