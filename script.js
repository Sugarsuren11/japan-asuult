const vocab = [
  { word: "これ", romaji: "kore", meaning: "энэ" },
  { word: "それ", romaji: "sore", meaning: "тэр" },
  { word: "あれ", romaji: "are", meaning: "наадах" },
  { word: "この～", romaji: "kono", meaning: "энэ + нэр үг" },
  { word: "その～", romaji: "sono", meaning: "тэр + нэр үг" },
  { word: "あの～", romaji: "ano", meaning: "наадах + нэр үг" },
  { word: "ほん (本)", romaji: "hon", meaning: "ном" },
  { word: "じしょ (辞書)", romaji: "jisho", meaning: "толь бичиг" },
  { word: "ざっし (雑誌)", romaji: "zasshi", meaning: "сэтгүүл" },
  { word: "しんぶん (新聞)", romaji: "shinbun", meaning: "сонин" },
  { word: "ノート", romaji: "nooto", meaning: "дэвтэр" },
  { word: "てちょう (手帳)", romaji: "techou", meaning: "тэмдэглэлийн дэвтэр" },
  { word: "めいし (名刺)", romaji: "meishi", meaning: "нэрийн хуудас" },
  { word: "カード", romaji: "kaado", meaning: "карт" },
  { word: "テレホンカード", romaji: "terehon kaado", meaning: "утасны карт" },
  { word: "えんぴつ (鉛筆)", romaji: "enpitsu", meaning: "харандаа" },
  { word: "ボールペン", romaji: "boorupen", meaning: "балан үзэг" },
  { word: "シャープペンシル", romaji: "shaapu penshiru", meaning: "0.5 харандаа" },
  { word: "かぎ", romaji: "kagi", meaning: "түлхүүр" },
  { word: "とけい (時計)", romaji: "tokei", meaning: "цаг" },
  { word: "かさ (傘)", romaji: "kasa", meaning: "шүхэр" },
  { word: "かばん", romaji: "kaban", meaning: "цүнх" },
  { word: "（カセット）テープ", romaji: "kasetto teepu", meaning: "кассет" },
  { word: "テープレコーダー", romaji: "teepu rekoodaa", meaning: "магнитофон" },
  { word: "テレビ", romaji: "terebi", meaning: "телевизор" },
  { word: "ラジオ", romaji: "rajio", meaning: "радио" },
  { word: "カメラ", romaji: "kamera", meaning: "камер" },
  { word: "コンピューター", romaji: "konpyuutaa", meaning: "компьютер" },
  { word: "じどうしゃ (自動車)", romaji: "jidousha", meaning: "машин" },
  { word: "つくえ", romaji: "tsukue", meaning: "ширээ" },
  { word: "いす", romaji: "isu", meaning: "сандал" },
  { word: "チョコレート", romaji: "chokoreeto", meaning: "шоколад" },
  { word: "コーヒー", romaji: "koohii", meaning: "кофе" },
  { word: "えいご (英語)", romaji: "eigo", meaning: "англи хэл" },
  { word: "にほんご (日本語)", romaji: "nihongo", meaning: "япон хэл" },
  { word: "～ご (～語)", romaji: "～go", meaning: "~ хэл" },
  { word: "なん (何)", romaji: "nan", meaning: "юу, хэд, ямар" },
  { word: "そう", romaji: "sou", meaning: "тийм" },
  { word: "ちがいます", romaji: "chigaimasu", meaning: "биш, андуурсан байна" },
  { word: "そうですか", romaji: "sou desu ka", meaning: "тийм үү?" },
  { word: "あのう", romaji: "anou", meaning: "ээ…" },
  { word: "ほんのきもちです", romaji: "hon no kimochi desu", meaning: "жаахан юм" },
  { word: "どうぞ", romaji: "douzo", meaning: "тэг тэг, май" },
  { word: "どうも", romaji: "doumo", meaning: "баярлалаа" },
  { word: "これからおせわになります", romaji: "kore kara osewa ni narimasu", meaning: "дэмжлэгээ хүсье" },
  { word: "（どうも）ありがとう ございます", romaji: "doumo arigatou gozaimasu", meaning: "маш их баярлалаа" },
  { word: "こちらこそよろしく", romaji: "kochira koso yoroshiku", meaning: "би ч гэсэн танилцсандаа таатай байна" }
];

const wordEl = document.getElementById("word");
const romajiEl = document.getElementById("romaji");
const choicesEl = document.getElementById("choices");
const scoreEl = document.getElementById("score");
const mode1Btn = document.getElementById("mode1");
const mode2Btn = document.getElementById("mode2");

let score = 0;
let currentMode = "mode1";
let wordHistory = []; // Асуултын түүхийг хадгалах

function updateScore(correct) {
  if (correct) {
    score += 1; // Зөв хариулт бүрт 1 оноо нэмнэ
  } else {
    score = Math.max(0, score - 1); // Буруу хариулт бүрт 1 оноо хасна, 0-ээс доош унахгүй
  }
  scoreEl.textContent = `Оноо: ${score}`;
}

function getRandomWord() {
  let availableWords = vocab.filter(word => {
    const wordCount = wordHistory.filter(w => w.word === word.word).length;
    return wordCount < 2; // Нэг үг 2-оос дээш давтагдахгүй
  });

  if (availableWords.length === 0) {
    wordHistory = []; // Бүх үг 2 удаа давтагдсан бол түүхийг цэвэрлэх
    availableWords = vocab;
  }

  const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
  wordHistory.push(randomWord);
  return randomWord;
}

function displayQuestion() {
  const currentWord = getRandomWord();
  
  if (currentMode === "mode1") {
    // Формат 1: Асуулт япон бичиг, галигтай, хариулт монгол утгаар
    wordEl.textContent = currentWord.word;
    romajiEl.textContent = currentWord.romaji;

    choicesEl.innerHTML = "";
    const options = [currentWord.meaning];
    while (options.length < 4) {
      const randomWord = getRandomWord();
      if (!options.includes(randomWord.meaning) && randomWord.meaning !== currentWord.meaning) {
        options.push(randomWord.meaning);
      }
    }
    options.sort(() => Math.random() - 0.5);
    options.forEach(option => {
      const button = document.createElement("button");
      button.textContent = option;
      button.addEventListener("click", () => {
        choicesEl.querySelectorAll("button").forEach(btn => {
          btn.disabled = true;
          if (btn.textContent === currentWord.meaning) {
            btn.classList.add("correct");
          }
        });
        if (option === currentWord.meaning) {
          button.classList.add("correct");
          updateScore(true);
        } else {
          button.classList.add("wrong");
          updateScore(false);
        }
        setTimeout(() => {
          choicesEl.querySelectorAll("button").forEach(btn => {
            btn.classList.remove("correct", "wrong");
          });
          displayQuestion();
        }, 1500);
      });
      choicesEl.appendChild(button);
    });
  } else {
    // Формат 2: Асуулт монгол утгаар, хариулт япон бичиг, галигтай
    wordEl.textContent = currentWord.meaning;
    romajiEl.textContent = "";

    choicesEl.innerHTML = "";
    const options = [currentWord];
    while (options.length < 4) {
      const randomWord = getRandomWord();
      if (!options.some(opt => opt.word === randomWord.word)) {
        options.push(randomWord);
      }
    }
    options.sort(() => Math.random() - 0.5);
    options.forEach(option => {
      const button = document.createElement("button");
      button.textContent = `${option.word} (${option.romaji})`;
      button.dataset.word = option.word;
      button.addEventListener("click", () => {
        choicesEl.querySelectorAll("button").forEach(btn => {
          btn.disabled = true;
          if (btn.dataset.word === currentWord.word) {
            btn.classList.add("correct");
          }
        });
        if (option.word === currentWord.word) {
          button.classList.add("correct");
          updateScore(true);
        } else {
          button.classList.add("wrong");
          updateScore(false);
        }
        setTimeout(() => {
          choicesEl.querySelectorAll("button").forEach(btn => {
            btn.classList.remove("correct", "wrong");
          });
          displayQuestion();
        }, 1500);
      });
      choicesEl.appendChild(button);
    });
  }
}

function setMode(mode) {
  currentMode = mode;
  mode1Btn.classList.toggle("active", mode === "mode1");
  mode2Btn.classList.toggle("active", mode === "mode2");
  wordHistory = []; // Форматыг өөрчлөхдөө түүхийг шинэчлэх
  displayQuestion();
}

mode1Btn.addEventListener("click", () => setMode("mode1"));
mode2Btn.addEventListener("click", () => setMode("mode2"));

document.addEventListener("DOMContentLoaded", () => {
  updateScore(false);
  displayQuestion();
});
