let words = [];
let usedIndexes = new Set();
let score = 0;
let lang = "jp";

const questionText = document.getElementById("questionText");
const optionsDiv = document.getElementById("options");
const scoreDisplay = document.getElementById("score");
const startMenu = document.getElementById("startMenu");
const gameArea = document.getElementById("gameArea");

// HTML элементүүд байгаа эсэхийг шалгах
if (!questionText || !optionsDiv || !scoreDisplay || !startMenu || !gameArea) {
  console.error("HTML элементүүд олдсонгүй. ID-уудыг шалгана уу.");
}

// vocab.json файлыг ачаалах
async function loadVocab() {
  try {
    const res = await fetch("vocab.json");
    if (!res.ok) throw new Error("vocab.json файлыг ачаалж чадсангүй.");
    words = await res.json();
    console.log("Ачаалсан өгөгдөл:", words); // Дибаг хийх
    if (!words.length) throw new Error("vocab.json хоосон байна.");
  } catch (error) {
    console.error("Алдаа:", error);
    alert("Өгөгдөл ачааллахад алдаа гарлаа. vocab.json файлыг шалгана уу.");
  }
}

async function startGame(selectedLang) {
  await loadVocab(); // vocab.json ачаалж дуусахыг хүлээх
  if (!words.length) return; // Хэрвээ өгөгдөл байхгүй бол зогсоох

  lang = selectedLang;
  score = 0;
  usedIndexes.clear();
  scoreDisplay.innerText = `Оноо: ${score}`;
  startMenu.style.display = "none";
  gameArea.style.display = "block";
  newQuestion();
}

function newQuestion() {
  if (!words.length) {
    questionText.innerText = "Өгөгдөл хоосон байна!";
    optionsDiv.innerHTML = "";
    return;
  }

  if (usedIndexes.size >= words.length) {
    questionText.innerText = "Тоглоом дууслаа!";
    optionsDiv.innerHTML = "";
    return;
  }

  optionsDiv.innerHTML = "";

  let index;
  do {
    index = Math.floor(Math.random() * words.length);
  } while (usedIndexes.has(index));
  usedIndexes.add(index);

  const current = words[index];
  const question = lang === "jp" ? current.kana : current.mongolian;
  const correctAnswer = lang === "jp" ? current.mongolian : current.kana;

  questionText.innerText = question;

  let choices = [correctAnswer];
  while (choices.length < 4) {
    const rand = words[Math.floor(Math.random() * words.length)];
    const distractor = lang === "jp" ? rand.mongolian : rand.kana;
    if (!choices.includes(distractor)) choices.push(distractor);
  }

  shuffle(choices);
  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => {
      if (choice === correctAnswer) {
        score++;
        scoreDisplay.innerText = `Оноо: ${score}`;
      } else {
        alert(`Зөв хариулт: ${correctAnswer}`);
      }
      newQuestion();
    };
    optionsDiv.appendChild(btn);
  });
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
