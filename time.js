function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const timeString = `${hours}:${minutes}:${seconds}`;

    document.querySelector('.date').textContent = "いまは" + timeString + "です。";
}

// 1秒ごとに時間を更新
setInterval(updateTime, 1000);

// ページ読み込み時に即座に時間を表示
updateTime();
