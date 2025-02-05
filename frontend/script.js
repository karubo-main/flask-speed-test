const BASE_URL = "https://flask-speed-test-1jc9.onrender.com";

// 測定開始ボタンの処理
document.getElementById('startTest').addEventListener('click', async function() {
    let buttonText = document.getElementById('buttonText');
    let resultsDiv = document.getElementById('results');
    let loadingDiv = document.getElementById('loading');

    // 測定中はボタンを「Go」に変更し、UIの表示を制御
    buttonText.innerText = "Go";
    resultsDiv.classList.remove('show');
    loadingDiv.classList.remove('hidden');

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

    // ダウンロード速度測定
    const downloadStart = performance.now();
    const downloadResponse = await fetch(`${BASE_URL}/download`);
    await downloadResponse.blob();
    const downloadEnd = performance.now();
    const downloadSpeed = (50 * 8) / ((downloadEnd - downloadStart) / 1000);
    document.getElementById('downloadSpeed').innerText = downloadSpeed.toFixed(2);

    updateProgress(70);

    // アップロード速度測定
    const uploadStart = performance.now();
    const uploadResponse = await fetch(`${BASE_URL}/upload`, { method: 'POST', body: new Blob([new Uint8Array(50 * 1024 * 1024)]) });
    const uploadEnd = performance.now();
    const uploadResult = await uploadResponse.json();
    document.getElementById('uploadSpeed').innerText = uploadResult.upload_speed || "エラー";

    updateProgress(100);

    // 測定完了後に結果を表示（UIを戻さない）
    setTimeout(() => {
        loadingDiv.classList.add('hidden'); // 測定中アニメーションを非表示
        resultsDiv.classList.add('show'); // 測定結果を表示
        buttonText.innerText = "Ready"; // ボタンをReadyに戻すが、結果はそのまま
    }, 500);
});
