console.log("nansisanのページ")
// 数当てゲーム (コンソールのみで動作)

// ランダムな数を生成する (1から100まで)
const secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

console.log("1から100までの数を当ててみて。 guess()で当てる。");

function guess(number) {
    const guess = parseInt(number, 10);
    attempts++;

    if (isNaN(guess)) {
        console.log("有効な数を入力してください。");
    } else if (guess < secretNumber) {
        console.log("もっと大きい数よ。");
    } else if (guess > secretNumber) {
        console.log("もっと小さい数よ。");
    } else {
        console.log(`おめでとう！正解は${secretNumber}でした。`);
        console.log(`あんたは${attempts}回で当てたわね。`);
    }
}

// 遊び方の例:
// 例えば、数を推測するにはコンソールで次のように入力する:
// guess(50);
