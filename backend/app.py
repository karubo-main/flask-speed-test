from flask import Flask, request, send_file, jsonify, after_this_request, send_from_directory
import os
import tempfile
import time
import threading

# Flaskアプリケーションを作成し、フロントエンドのディレクトリを指定
app = Flask(__name__, static_folder="../frontend", static_url_path="")

# ルートページ（フロントエンドの index.html を提供）
@app.route('/')
def home():
    return send_from_directory(app.static_folder, "index.html")

# Ping測定（レイテンシ確認用）
@app.route('/ping', methods=['GET'])
def ping():
    return "pong", 200

# ダウンロード速度測定（50MBのファイルを返す）
@app.route('/download', methods=['GET'])
def download():
    try:
        # 一時ディレクトリの取得
        temp_dir = tempfile.gettempdir()
        file_path = os.path.join(temp_dir, "testfile.bin")

        # 既存のファイルを削除して新規作成（50MBのランダムデータ）
        with open(file_path, "wb") as f:
            f.write(os.urandom(50 * 1024 * 1024))  # 50MB

        # リクエストが完了した後にファイルを削除（エラー防止）
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

# アップロード速度測定（50MBのデータをアップロード）
@app.route('/upload', methods=['POST'])
def upload():
    try:
        start_time = time.time()
        request.data  # 受信データを無視（速度測定用）
        elapsed_time = time.time() - start_time

        # 50MB（400Mb）をアップロードするのにかかった時間で速度計算
        upload_speed = (50 * 8) / elapsed_time  # Mbps

        return jsonify({"upload_speed": round(upload_speed, 2)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# サーバー起動
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
