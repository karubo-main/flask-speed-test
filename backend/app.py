from flask import Flask, request, send_file, jsonify
import os
import time
import tempfile

app = Flask(__name__)

# ルートページ（確認用）
@app.route('/')
def home():
    return "Flask サーバーは動作しています！", 200

# Ping測定（レイテンシ確認用）
@app.route('/ping', methods=['GET'])
def ping():
    return "pong", 200

# ダウンロード速度測定（5MBのファイルを返す）
@app.route('/download', methods=['GET'])
def download():
    try:
        # 一時ファイルを作成
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(os.urandom(5 * 1024 * 1024))  # 5MBのランダムデータ
            tmp_path = tmp.name

        return send_file(tmp_path, as_attachment=True)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# アップロード速度測定（データを受け取るが保存はしない）
@app.route('/upload', methods=['POST'])
def upload():
    request.data  # 受信データを無視（速度測定用）
    return jsonify({"status": "ok"})

# サーバー起動
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
