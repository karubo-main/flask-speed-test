const BASE_URL = "https://flask-speed-test-1jc9.onrender.com";

// 測定開始ボタンが押されたときの動作
document.getElementById('startTest').addEventListener('click', async function() {
    // ボタンアニメーション
    let reactor = document.getElementById('arc-reactor');
    reactor.classList.add('active');

    // UIの変更
    document.getElementById('results').classList.remove('show');
    document.getElementById('loading').classList.remove('hidden');

    // 進捗更新関数
    const updateProgress = (value) => {
        document.getElementById('progress').innerText = value;
        document.getElementById('progressBar').style.strokeDashoffset = 283 - (283 * value) / 100;
    };

    updateProgress(10);

    // Ping測定
    const pingStart = performance.now();
    await fetch(`${BASE_URL}/ping`);
    const pingEnd = performance.now();
    document.getElementById('pingTime').innerText = ((pingEnd - pingStart).toFixed(2));

    updateProgress(30);

    // ダウンロード速度測定（50MBファイル）
    const downloadStart = performance.now();
    const downloadResponse = await fetch(`${BASE_URL}/download`);
    await downloadResponse.blob();
    const downloadEnd = performance.now();
    const downloadSpeed = (50 * 8) / ((downloadEnd - downloadStart) / 1000);
    document.getElementById('downloadSpeed').innerText = downloadSpeed.toFixed(2);

    updateProgress(70);

    // アップロード速度測定（50MBデータをアップロード）
    const uploadStart = performance.now();
    const uploadResponse = await fetch(`${BASE_URL}/upload`, { method: 'POST', body: new Blob([new Uint8Array(50 * 1024 * 1024)]) });
    const uploadEnd = performance.now();
    const uploadResult = await uploadResponse.json();
    document.getElementById('uploadSpeed').innerText = uploadResult.upload_speed || "エラー";

    updateProgress(100);
    
    // 測定完了後のUI変更
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('results').classList.add('show');
        reactor.classList.remove('active');
    }, 500);
});
