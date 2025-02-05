from flask import Flask, request, send_file, jsonify, after_this_request
import os
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
        # 一時ディレクトリの取得
        temp_dir = tempfile.gettempdir()
        file_path = os.path.join(temp_dir, "testfile.bin")

        # 既存のファイルを削除して新規作成
        with open(file_path, "wb") as f:
            f.write(os.urandom(5 * 1024 * 1024))  # 5MBのランダムデータ

        # リクエストが完了した後にファイルを削除（エラーを防ぐ）
        @after_this_request
        def remove_file(response):
            try:
                os.remove(file_path)
            except Exception as e:
                app.logger.error(f"ファイル削除エラー: {e}")
            return response

        return send_file(file_path, as_attachment=True)

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
