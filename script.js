let words = [];
let usedIndexes = new Set();
let score = 0;
let lang = "jp";
let attempts = 0;
const maxAttempts = 2;
let currentQuestion = null;
let timerTimeout;

const questionText = document.getElementById("questionText");
const answerInput = document.getElementById("answerInput");
const optionsDiv = document.getElementById("options");
const scoreDisplay = document.getElementById("score");
const startMenu = document.getElementById("startMenu");
const gameArea = document.getElementById("gameArea");
const feedbackEl = document.getElementById("feedback");
const progressBar = document.getElementById("progressBar");

// HTML элементүүд байгаа эсэхийг шалгах
if (!questionText || !answerInput || !optionsDiv || !scoreDisplay || !startMenu || !gameArea || !feedbackEl || !progressBar) {
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
  answerInput.value = "";
  startMenu.style.display = "none";
  gameArea.style.display = "block";
  newQuestion();
}

function startVisualTimer() {
  progressBar.classList.remove("shrink");
  void progressBar.offsetWidth;
  progressBar.classList.add("shrink");

  clearTimeout(timerTimeout);
  timerTimeout = setTimeout(() => {
    showAnswer();
  }, 60000);
}

function newQuestion() {
  if (!words.length) {
    questionText.innerText = "Өгөгдөл хоосон байна!";
    feedbackEl.innerText = "";
    answerInput.value = "";
    return;
  }

  if (usedIndexes.size >= words.length) {
    questionText.innerText = "Тоглоом дууслаа! 🎉";
    feedbackEl.innerText = `Таны оноо: ${score}`;
    answerInput.value = "";
    return;
  }

  attempts = 0;
  feedbackEl.innerText = "";
  answerInput.value = "";

  let index;
  do {
    index = Math.floor(Math.random() * words.length);
  } while (usedIndexes.has(index));
  usedIndexes.add(index);

  currentQuestion = words[index];
  const isJapaneseToMongolian = lang === "jp";
  currentQuestion.question = isJapaneseToMongolian ? currentQuestion.kana : currentQuestion.mongolian;
  currentQuestion.answer = isJapaneseToMongolian ? currentQuestion.mongolian : currentQuestion.kana;

  questionText.innerText = currentQuestion.question;
  startVisualTimer();
}

function checkAnswer() {
  const userAnswer = answerInput.value.trim();
  const correct = userAnswer === currentQuestion.answer;
  clearTimeout(timerTimeout);
  progressBar.classList.remove("shrink");

  if (correct) {
    score++;
    scoreDisplay.innerText = `Оноо: ${score}`;
    feedbackEl.innerText = "✅ Зөв!";
    answerInput.value = "";
    setTimeout(newQuestion, 1000);
  } else {
    attempts++;
    feedbackEl.innerText = `❌ Буруу! (${attempts}/${maxAttempts} оролдлого)`;
    answerInput.value = "";
    if (attempts >= maxAttempts) {
      showAnswer();
    } else {
      startVisualTimer();
    }
  }
}

function showAnswer() {
  clearTimeout(timerTimeout);
  progressBar.classList.remove("shrink");
  feedbackEl.innerText = `❌ ${attempts >= maxAttempts ? "Оролдлого дууслаа" : "Хугацаа дууслаа"}! Зөв хариулт: ${currentQuestion.answer}`;
  answerInput.value = "";
  setTimeout(() => {
    if (confirm("Дахин эхлэх үү?")) {
      score = 0;
      attempts = 0;
      usedIndexes.clear();
      scoreDisplay.innerText = `Оноо: ${score}`;
      feedbackEl.innerText = "";
      answerInput.value = "";
      newQuestion();
    } else {
      questionText.innerText = "Тоглоом дууссан 🎌";
      feedbackEl.innerText = `Таны оноо: ${score}`;
      answerInput.value = "";
    }
  }, 1000);
}
