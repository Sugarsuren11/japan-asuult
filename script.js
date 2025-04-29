const vocab = [
  { word: "わたし", romaji: "watashi", meaning: "би" },
  { word: "あなた", romaji: "anata", meaning: "чи, та" },
  { word: "さん", romaji: "san", meaning: "-сан (хүндэтгэлтэй дуудлага)" },
  { word: "くん", romaji: "kun", meaning: "-кун (ихэвчлэн эрэгтэй хүүхэд, дотнын найзад)" },
  { word: "ちゃん", romaji: "chan", meaning: "-чан (бяцхан хүүхэд, ойр дотно хүнд)" },
  { word: "せんせい", romaji: "sensei", meaning: "багш, эмч, мастер" },
  { word: "きょうし", romaji: "kyoushi", meaning: "(мэргэжлийн) багш" },
  { word: "がくせい", romaji: "gakusei", meaning: "оюутан, сурагч" },
  { word: "かいしゃいん", romaji: "kaishain", meaning: "компанийн ажилтан" },
  { word: "しゃいん", romaji: "shain", meaning: "(тодорхой компанийн) ажилтан" },
  { word: "ぎんこういん", romaji: "ginkouin", meaning: "банкны ажилтан" },
  { word: "いしゃ", romaji: "isha", meaning: "эмч" },
  { word: "けんきゅうしゃ", romaji: "kenkyuusha", meaning: "судлаач" },
  { word: "けんきゅう", romaji: "kenkyuu", meaning: "судалгаа" },
  { word: "だいがく", romaji: "daigaku", meaning: "их сургууль" },
  { word: "びょういん", romaji: "byouin", meaning: "эмнэлэг" },
  { word: "だれ", romaji: "dare", meaning: "хэн" },
  { word: "どなた", romaji: "donata", meaning: "хэн (хүндэтгэлтэй хэлбэр)" },
  { word: "アメリカ", romaji: "Amerika", meaning: "Америк" },
  { word: "イギリス", romaji: "Igirisu", meaning: "Англи" },
  { word: "インド", romaji: "Indo", meaning: "Энэтхэг" },
  { word: "インドネシア", romaji: "Indoneshia", meaning: "Индонез" },
  { word: "ちゅうごく", romaji: "Chuugoku", meaning: "Хятад" },
  { word: "かんこく", romaji: "Kankoku", meaning: "Солонгос" },
  { word: "ブラジル", romaji: "Burajiru", meaning: "Бразил" },
  { word: "ドイツ", romaji: "Doitsu", meaning: "Герман" },
  { word: "にほん", romaji: "Nihon", meaning: "Япон" },
];

const wordEl = document.getElementById("word");
const romajiEl = document.getElementById("romaji");
const choicesEl = document.getElementById("choices");

function getRandomWord() {
  return vocab[Math.floor(Math.random() * vocab.length)];
}

function generateChoices(correctMeaning) {
  const meanings = vocab.map(v => v.meaning).filter(m => m !== correctMeaning);
  const shuffled = meanings.sort(() => 0.5 - Math.random()).slice(0, 3);
  const all = [...shuffled, correctMeaning].sort(() => 0.5 - Math.random());
  return all;
}

function loadQuestion() {
  const current = getRandomWord();
  wordEl.textContent = current.word;
  romajiEl.textContent = current.romaji;

  const choices = generateChoices(current.meaning);
  choicesEl.innerHTML = "";

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => {
      if (choice === current.meaning) {
        btn.classList.add("correct");
      } else {
        btn.classList.add("wrong");
      }
      setTimeout(loadQuestion, 1000);
    };
    choicesEl.appendChild(btn);
  });
}

loadQuestion();
