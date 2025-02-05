const BASE_URL = "https://flask-speed-test-1jc9.onrender.com";

document.getElementById('startTest').addEventListener('click', async function() {
    document.getElementById('downloadSpeed').innerText = '測定中...';
    document.getElementById('uploadSpeed').innerText = '測定中...';
    document.getElementById('pingTime').innerText = '測定中...';

    const pingStart = performance.now();
    await fetch(`${BASE_URL}/ping`);
    const pingEnd = performance.now();
    document.getElementById('pingTime').innerText = ((pingEnd - pingStart).toFixed(2));

    const downloadStart = performance.now();
    const downloadResponse = await fetch(`${BASE_URL}/download`);
    await downloadResponse.blob();
    const downloadEnd = performance.now();
    const downloadSpeed = (50 * 8) / ((downloadEnd - downloadStart) / 1000);
    document.getElementById('downloadSpeed').innerText = downloadSpeed.toFixed(2);
});
