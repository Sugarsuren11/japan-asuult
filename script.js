let words = [];
let usedIndexes = new Set();
let score = 0;
let lang = "jp";
let attempts = 0;
const maxAttempts = 2;
let currentQuestion = null;
let timerTimeout;

const questionText = document.getElementById("questionText");
const optionsDiv = document.getElementById("options");
const scoreDisplay = document.getElementById("score");
const startMenu = document.getElementById("startMenu");
const gameArea = document.getElementById("gameArea");
const feedbackEl = document.getElementById("feedback");
const progressBar = document.getElementById("progressBar");

// HTML элементүүд байгаа эсэхийг шалгах
if (!questionText || !optionsDiv || !scoreDisplay || !startMenu || !gameArea || !feedbackEl || !progressBar) {
  console.error("HTML элементүүд олдсонгүй. ID-уудыг шалгана уу.");
}

// vocab.json файлыг ачаалах
async function loadVocab() {
  try {
    const res = await fetch("vocab.json");
    if (!res.ok) throw new Error("vocab.json файлыг ачаалж чадсангүй.");
    words = await res.json();
    console.log("Ачаалсан өгөгдөл:", words);
    if (!words.length) throw new Error("vocab.json хоосон байна.");
  } catch (error) {
    console.error("Алдаа:", error);
    alert("Өгөгдөл ачааллахад алдаа гарлаа. vocab.json файлыг шалгана уу.");
  }
}

async function startGame(selectedLang) {
  await loadVocab();
  if (!words.length) return;

  lang = selectedLang;
  score = 0;
  attempts = 0;
  usedIndexes.clear();
  scoreDisplay.innerText = `Оноо: ${score}`;
  feedbackEl.innerText = "";
  startMenu.style.display = "none";
  gameArea.style.display = "block";
  newQuestion();
}

function startVisualTimer() {
  progressBar.style.animation = "none";
  void progressBar.offsetWidth;
  progressBar.style.animation = "shrink 60s linear forwards";

  clearTimeout(timerTimeout);
  timerTimeout = setTimeout(() => {
    showAnswer();
  }, 60000);
}

function getNeighborChoices(index, correctAnswer, isMongolian) {
  const choices = [correctAnswer];
  const availableNeighbors = [];

  // Дээрх болон доорх индексүүдийг авах (хязгаарыг шалгах)
  const neighborIndexes = [
    index - 2, index - 1, index + 1, index + 2
  ].filter(i => i >= 0 && i < words.length && i !== index);

  // Хөрш зэргэлдээ элементүүдийг авах
  neighborIndexes.forEach(i => {
    const value = isMongolian ? words[i].mongolian : words[i].kana;
    if (!choices.includes(value)) {
      availableNeighbors.push(value);
    }
  });

  // 3 буруу сонголтыг санамсаргүйгээр сонгох
  while (choices.length < 4 && availableNeighbors.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableNeighbors.length);
    choices.push(availableNeighbors.splice(randomIndex, 1)[0]);
  }

  // Хэрвээ хангалттай хөрш байхгүй бол бусад үгнүүдээс нөхнө
  while (choices.length < 4) {
    const randomIndex = Math.floor(Math.random() * words.length);
    const value = isMongolian ? words[randomIndex].mongolian : words[randomIndex].kana;
    if (!choices.includes(value)) {
      choices.push(value);
    }
  }

  // Сонголтуудыг санамсаргүй холино
  shuffle(choices);
  return choices;
}

function newQuestion() {
  if (!words.length) {
    questionText.innerText = "Өгөгдөл хоосон байна!";
    optionsDiv.innerHTML = "";
    feedbackEl.innerText = "";
    return;
  }

  if (usedIndexes.size >= words.length) {
    questionText.innerText = "Тоглоом дууслаа! 🎉";
    optionsDiv.innerHTML = "";
    feedbackEl.innerText = `Таны оноо: ${score}`;
    return;
  }

  optionsDiv.innerHTML = "";
  attempts = 0;
  feedbackEl.innerText = "";

  let index;
  do {
    index = Math.floor(Math.random() * words.length);
  } while (usedIndexes.has(index));
  usedIndexes.add(index);

  currentQuestion = words[index];
  const isJapaneseToMongolian = lang === "jp";
  currentQuestion.question = isJapaneseToMongolian ? currentQuestion.kana : currentQuestion.mongolian;
  currentQuestion.answer = isJapaneseToMongolian ? currentQuestion.mongolian : currentQuestion.kana;
  currentQuestion.options = getNeighborChoices(index, currentQuestion.answer, isJapaneseToMongolian);

  questionText.innerText = currentQuestion.question;
  showChoices(currentQuestion.options);
  startVisualTimer();
}

function showChoices(options) {
  optionsDiv.innerHTML = "";
  options.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(i);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selected) {
  const correct = currentQuestion.options[selected] === currentQuestion.answer;
  clearTimeout(timerTimeout);
  progressBar.style.animation = "none";

  if (correct) {
    score++;
    scoreDisplay.innerText = `Оноо: ${score}`;
    feedbackEl.innerText = "✅ Зөв!";
    setTimeout(newQuestion, 1000);
  } else {
    attempts++;
    feedbackEl.innerText = `❌ Буруу! (${attempts}/${maxAttempts} оролдлого)`;
    if (attempts >= maxAttempts) {
      showAnswer();
    } else {
      startVisualTimer();
    }
  }
}

function showAnswer() {
  clearTimeout(timerTimeout);
  progressBar.style.animation = "none";
  feedbackEl.innerText = `❌ ${attempts >= maxAttempts ? "Оролдлого дууслаа" : "Хугацаа дууслаа"}! Зөв хариулт: ${currentQuestion.answer}`;
  setTimeout(() => {
    if (confirm("Дахин эхлэх үү?")) {
      score = 0;
      attempts = 0;
      usedIndexes.clear();
      scoreDisplay.innerText = `Оноо: ${score}`;
      feedbackEl.innerText = "";
      newQuestion();
    } else {
      questionText.innerText = "Тоглоом дууссан 🎌";
      optionsDiv.innerHTML = "";
      feedbackEl.innerText = `Таны оноо: ${score}`;
    }
  }, 1000);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
