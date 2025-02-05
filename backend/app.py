from flask import Flask, request, send_file, jsonify
import os

app = Flask(__name__)

# ルートページ（エラー回避用）
@app.route('/')
def home():
    return "Flask サーバーは動作しています！", 200

# Ping測定
@app.route('/ping', methods=['GET'])
def ping():
    return "pong", 200

# ダウンロード速度測定（5MBのファイルを返す）
@app.route('/download', methods=['GET'])
def download():
    file_path = "testfile.bin"
    if not os.path.exists(file_path):
        with open(file_path, "wb") as f:
            f.write(os.urandom(5 * 1024 * 1024))  # 5MBのランダムデータ
    return send_file(file_path, as_attachment=True)

# アップロード速度測定
@app.route('/upload', methods=['POST'])
def upload():
    request.data  # 受信データを無視（速度測定用）
    return jsonify({"status": "ok"})

# サーバー起動
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
