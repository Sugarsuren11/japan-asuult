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
const choicesEl = document.getElementById("choices");
const scoreEl = document.getElementById("score");
const mode1Btn = document.getElementById("mode1");
const mode2Btn = document.getElementById("mode2");

let score = 0;
let currentMode = "mode1";
let wordHistory = [];

function updateScore(correct) {
  if (correct) {
    score += 1;
  } else {
    score = Math.max(0, score - 1);
  }
  scoreEl.textContent = `Оноо: ${score}`;
}

function getRandomWord() {
  let availableWords = vocab.filter(word => {
    const wordCount = wordHistory.filter(w => w.word === word.word).length;
    return wordCount < 2;
  });

  if (availableWords.length === 0) {
    wordHistory = [];
    availableWords = vocab;
  }

  const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
  wordHistory.push(randomWord);
  return randomWord;
}

function displayQuestion() {
  const currentWord = getRandomWord();
  
  if (currentMode === "mode1") {
    // Mode 1: Японы галигийг харуулж, Монгол утгыг сонгуулна
    wordEl.textContent = currentWord.word;
    
    // Сонголтууд: Монгол утгууд
    choicesEl.innerHTML = "";
    const correctAnswer = currentWord.meaning;
    const allAnswers = [correctAnswer];
    
    // 3 буруу Монгол утга сонгох
    while (allAnswers.length < 4) {
      const randomWord = vocab[Math.floor(Math.random() * vocab.length)];
      if (!allAnswers.includes(randomWord.meaning)) {
        allAnswers.push(randomWord.meaning);
      }
    }
    
    // Сонголтуудыг холино
    allAnswers.sort(() => Math.random() - 0.5);
    
    // Сонголтуудыг HTML-д нэмнэ
    allAnswers.forEach(answer => {
      const button = document.createElement("button");
      button.textContent = answer;
      button.addEventListener("click", () => {
        // Бүх товчлуурыг идэвхгүй болгоно
        const buttons = choicesEl.querySelectorAll("button");
        buttons.forEach(btn => btn.disabled = true);
        
        // Зөв эсвэл бурууг харуулах
        if (answer === correctAnswer) {
          button.classList.add("correct");
          updateScore(true);
          setTimeout(displayQuestion, 1000); // 1 секундын дараа дараагийн асуулт
        } else {
          button.classList.add("wrong");
          updateScore(false);
          // Зөв хариултыг тодруулах
          buttons.forEach(btn => {
            if (btn.textContent === correctAnswer) {
              btn.classList.add("correct");
            }
          });
          setTimeout(() => {
            buttons.forEach(btn => btn.disabled = false); // Товчлуурыг буцааж идэвхжүүлнэ
            buttons.forEach(btn => btn.classList.remove("correct", "wrong")); // Классуудыг арилгана
          }, 1000);
        }
      });
      choicesEl.appendChild(button);
    });
  } else {
    // Mode 2: Монгол утгыг харуулж, Японы галигийг сонгуулна
    wordEl.textContent = currentWord.meaning;
    
    // Сонголтууд: Японы галигууд
    choicesEl.innerHTML = "";
    const correctAnswer = currentWord.word;
    const allAnswers = [correctAnswer];
    
    // 3 буруу Японы галиг сонгох
    while (allAnswers.length < 4) {
      const randomWord = vocab[Math.floor(Math.random() * vocab.length)];
      if (!allAnswers.includes(randomWord.word)) {
        allAnswers.push(randomWord.word);
      }
    }
    
    // Сонголтуудыг холино
    allAnswers.sort(() => Math.random() - 0.5);
    
    // Сонголтуудыг HTML-д нэмнэ
    allAnswers.forEach(answer => {
      const button = document.createElement("button");
      button.textContent = answer;
      button.addEventListener("click", () => {
        // Бүх товчлуурыг идэвхгүй болгоно
        const buttons = choicesEl.querySelectorAll("button");
        buttons.forEach(btn => btn.disabled = true);
        
        // Зөв эсвэл бурууг харуулах
        if (answer === correctAnswer) {
          button.classList.add("correct");
          updateScore(true);
          setTimeout(displayQuestion, 1000); // 1 секундын дараа дараагийн асуулт
        } else {
          button.classList.add("wrong");
          updateScore(false);
          // Зөв хариултыг тодруулах
          buttons.forEach(btn => {
            if (btn.textContent === correctAnswer) {
              btn.classList.add("correct");
            }
          });
          setTimeout(() => {
            buttons.forEach(btn => btn.disabled = false); // Товчлуурыг буцааж идэвхжүүлнэ
            buttons.forEach(btn => btn.classList.remove("correct", "wrong")); // Классуудыг арилгана
          }, 1000);
        }
      });
      choicesEl.appendChild(button);
    });
  }
}

// Горимын товчлууруудын үйлдэл
mode1Btn.addEventListener("click", () => {
  currentMode = "mode1";
  mode1Btn.classList.add("active");
  mode2Btn.classList.remove("active");
  displayQuestion();
});

mode2Btn.addEventListener("click", () => {
  currentMode = "mode2";
  mode2Btn.classList.add("active");
  mode1Btn.classList.remove("active");
  displayQuestion();
});

// Эхний асуултыг харуулах
displayQuestion();
