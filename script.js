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
  { word: "ほんのきもちです", romaji: "hon no kimochi desu", meaning: "Жаахан юм" },
  { word: "どうぞ", romaji: "douzo", meaning: "Тэг тэг, май" },
  { word: "どうも", romaji: "doumo", meaning: "Баярлалаа" },
  { word: "これからおせわになります", romaji: "kore kara osewa ni narimasu", meaning: "Дэмжлэгээ хүсье" },
  { word: "（どうも）ありがとう ございます", romaji: "doumo arigatou gozaimasu", meaning: "Маш их баярлалаа" },
  { word: "ありがとう（ございます）", romaji: "arigatou (gozaimasu)", meaning: "баярлалаа" },
  { word: "こちらこそよろしく", romaji: "kochira koso yoroshiku", meaning: "Би ч гэсэн танилцсандаа таатай байна" }
];

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
