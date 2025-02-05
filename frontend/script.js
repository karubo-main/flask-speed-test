const BASE_URL = "https://flask-speed-test-1jc9.onrender.com";

document.getElementById('startTest').addEventListener('click', async function() {
    document.getElementById('downloadSpeed').innerText = '測定中...';
    document.getElementById('uploadSpeed').innerText = '測定中...';
    document.getElementById('pingTime').innerText = '測定中...';

    // Ping測定
    const pingStart = performance.now();
    await fetch(`${BASE_URL}/ping`);
    const pingEnd = performance.now();
    document.getElementById('pingTime').innerText = ((pingEnd - pingStart).toFixed(2));

    // ダウンロード速度測定（20MBファイル）
    const downloadStart = performance.now();
    const downloadResponse = await fetch(`${BASE_URL}/download`);
    await downloadResponse.blob();
    const downloadEnd = performance.now();
    const downloadSpeed = (20 * 8) / ((downloadEnd - downloadStart) / 1000);
    document.getElementById('downloadSpeed').innerText = downloadSpeed.toFixed(2);

    // アップロード速度測定（20MBデータをアップロード）
    const uploadStart = performance.now();
    const uploadResponse = await fetch(`${BASE_URL}/upload`, { method: 'POST', body: new Blob([new Uint8Array(20 * 1024 * 1024)]) });
    const uploadEnd = performance.now();
    const uploadResult = await uploadResponse.json();
    document.getElementById('uploadSpeed').innerText = uploadResult.upload_speed || "エラー";
});
