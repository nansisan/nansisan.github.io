function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    if(hours >= 6 && hours < 11) message = "おはようございます。";
    else if (hours >= 11 && hours < 18) message ="こんにちは。"
    else message = "こんばんは。"

    const timeString = message + "いまは" + hours + ":" + minutes + ":" + seconds + "です。";

    document.querySelector('.time').textContent = timeString;
}

// 1秒ごとに時間を更新
setInterval(updateTime, 1000);

// ページ読み込み時に即座に時間を表示
updateTime();
