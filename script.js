// Кана хөрвүүлэгч
const hiraganaToKatakana = {
    'あ': 'ア', 'い': 'イ', 'う': 'ウ', 'え': 'エ', 'お': 'オ',
    'か': 'カ', 'き': 'キ', 'く': 'ク', 'け': 'ケ', 'こ': 'コ',
    'さ': 'サ', 'し': 'シ', 'す': 'ス', 'せ': 'セ', 'そ': 'ソ',
    'た': 'タ', 'ち': 'チ', 'つ': 'ツ', 'て': 'テ', 'と': 'ト',
    'な': 'ナ', 'に': 'ニ', 'ぬ': 'ヌ', 'ね': 'ネ', 'の': 'ノ',
    'は': 'ハ', 'ひ': 'ヒ', 'ふ': 'フ', 'へ': 'ヘ', 'ほ': 'ホ',
    'ま': 'マ', 'み': 'ミ', 'む': 'ム', 'め': 'メ', 'も': 'モ',
    'や': 'ヤ', 'ゆ': 'ユ', 'よ': 'ヨ',
    'ら': 'ラ', 'り': 'リ', 'る': 'ル', 'れ': 'レ', 'ろ': 'ロ',
    'わ': 'ワ', 'を': 'ヲ', 'ん': 'ン',
    'が': 'ガ', 'ぎ': 'ギ', 'ぐ': 'グ', 'げ': 'ゲ', 'ご': 'ゴ',
    'ざ': 'ザ', 'じ': 'ジ', 'ず': 'ズ', 'ぜ': 'ゼ', 'ぞ': 'ゾ',
    'だ': 'ダ', 'ぢ': 'ヂ', 'づ': 'ヅ', 'で': 'デ', 'ど': 'ド',
    'ば': 'バ', 'び': 'ビ', 'ぶ': 'ブ', 'べ': 'ベ', 'ぼ': 'ボ',
    'ぱ': 'パ', 'ぴ': 'ピ', 'ぷ': 'プ', 'ぺ': 'ペ', 'ぽ': 'ポ',
    'きゃ': 'キャ', 'きゅ': 'キュ', 'きょ': 'キョ',
    'しゃ': 'シャ', 'しゅ': 'シュ', 'しょ': 'ショ',
    'ちゃ': 'チャ', 'ちゅ': 'チュ', 'ちょ': 'チョ',
    'にゃ': 'ニャ', 'にゅ': 'ニュ', 'にょ': 'ニョ',
    'ひゃ': 'ヒャ', 'ひゅ': 'ヒュ', 'ひょ': 'ヒョ',
    'みゃ': 'ミャ', 'みゅ': 'ミュ', 'みょ': 'ミョ',
    'りゃ': 'リャ', 'りゅ': 'リュ', 'りょ': 'リョ',
    'ぎゃ': 'ギャ', 'ぎゅ': 'ギュ', 'ぎょ': 'ギョ',
    'じゃ': 'ジャ', 'じゅ': 'ジュ', 'じょ': 'ジョ',
    'びゃ': 'ビャ', 'びゅ': 'ビュ', 'びょ': 'ビョ',
    'ぴゃ': 'ピャ', 'ぴゅ': 'ピュ', 'ぴょ': 'ピョ',
    '（': '（', '）': '）', '～': '～', ' ': ' '
};

// HTML элементүүд
const wordEl = document.getElementById("word");
const romajiEl = document.getElementById("romaji");
const choicesEl = document.getElementById("choices");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const mode1Btn = document.getElementById("mode1");
const mode2Btn = document.getElementById("mode2");
const dictionaryToggleBtn = document.getElementById("dictionaryToggle");
const dictionaryEl = document.getElementById("dictionary");
const dictionaryListEl = document.getElementById("dictionaryList");
const inputTypeRadios = document.querySelectorAll('input[name="inputType"]');

// Тоглоомын төлөв
let vocab = [];
let score = 0;
let currentMode = "mode1"; // "mode1": Япон → Монгол, "mode2": Монгол → Япон
let currentInputType = "hiragana"; // "hiragana", "katakana", "romaji"
let wordHistory = [];
let seconds = 0;
let timerInterval;
let currentWord = null;

// Оноо шинэчлэх
function updateScore(correct) {
    if (correct) {
        score += 1;
    } else {
        score = Math.max(0, score - 1);
    }
    scoreEl.textContent = `Оноо: ${score}`;
}

// Санамсаргүй үг сонгох
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

// Хирагана → Катакана хөрвүүлэх
function convertHiraganaToKatakana(text) {
    let result = '';
    let i = 0;
    
    while (i < text.length) {
        if (i < text.length - 1) {
            const twoChars = text.substr(i, 2);
            if (hiraganaToKatakana[twoChars]) {
                result += hiraganaToKatakana[twoChars];
                i += 2;
                continue;
            }
        }
        
        const char = text[i];
        result += hiraganaToKatakana[char] || char;
        i++;
    }
    
    return result;
}

// Текстийг оролтын төрлөөр хөрвүүлэх
function convertText(text, type) {
    text = text.replace(/\([^)]*\)/g, '');
    
    if (type === "katakana") {
        return convertHiraganaToKatakana(text);
    } else if (type === "romaji") {
        const wordObj = vocab.find(w => w.word === text || w.word.includes(text));
        return wordObj ? wordObj.romaji : text;
    }
    
    return text;
}

// Асуулт харуулах
function displayQuestion() {
    currentWord = getRandomWord();
    
    if (currentMode === "mode1") {
        let displayText = currentWord.word;
        displayText = convertText(displayText, currentInputType);
        wordEl.textContent = displayText;
        romajiEl.textContent = currentInputType === "romaji" ? "" : currentWord.romaji;
        
        choicesEl.innerHTML = "";
        const correctAnswer = currentWord.meaning;
        const allAnswers = [correctAnswer];
        
        while (allAnswers.length < 4) {
            const randomWord = vocab[Math.floor(Math.random() * vocab.length)];
            if (!allAnswers.includes(randomWord.meaning)) {
                allAnswers.push(randomWord.meaning);
            }
        }
        
        allAnswers.sort(() => Math.random() - 0.5);
        
        allAnswers.forEach(answer => {
            const button = document.createElement("button");
            button.textContent = answer;
            button.className = "choice-btn";
            button.addEventListener("click", () => {
                handleAnswer(button, answer, correctAnswer);
            });
            choicesEl.appendChild(button);
        });
    } else {
        wordEl.textContent = currentWord.meaning;
        romajiEl.textContent = "";
        
        choicesEl.innerHTML = "";
        let correctAnswer = currentWord.word;
        const correctDisplay = convertText(correctAnswer, currentInputType);
        
        const allAnswers = [correctAnswer];
        
        while (allAnswers.length < 4) {
            const randomWord = vocab[Math.floor(Math.random() * vocab.length)];
            if (!allAnswers.includes(randomWord.word)) {
                allAnswers.push(randomWord.word);
            }
        }
        
        allAnswers.sort(() => Math.random() - 0.5);
        
        allAnswers.forEach(answer => {
            const button = document.createElement("button");
            const displayText = convertText(answer, currentInputType);
            button.textContent = displayText;
            button.className = "choice-btn";
            button.addEventListener("click", () => {
                handleAnswer(button, answer, correctAnswer);
            });
            choicesEl.appendChild(button);
        });
    }
}

// Хариултыг шалгах
function handleAnswer(button, answer, correctAnswer) {
    const buttons = choicesEl.querySelectorAll("button");
    buttons.forEach(btn => btn.disabled = true);
    
    if (answer === correctAnswer) {
        button.classList.add("correct");
        updateScore(true);
        setTimeout(() => {
            buttons.forEach(btn => {
                btn.disabled = false;
                btn.classList.remove("correct", "wrong");
            });
            displayQuestion();
        }, 1000);
    } else {
        button.classList.add("wrong");
        updateScore(false);
        
        buttons.forEach(btn => {
            if (btn.textContent === convertText(correctAnswer, currentInputType) || 
                (currentMode === "mode1" && btn.textContent === correctAnswer)) {
                btn.classList.add("correct");
            }
        });
        
        setTimeout(() => {
            buttons.forEach(btn => {
                btn.disabled = false;
                btn.classList.remove("correct", "wrong");
            });
        }, 2000);
    }
}

// Цаг шинэчлэх
function updateTimer() {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerEl.textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Цаг эхлүүлэх
function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    timerEl.textContent = "0:00";
    timerInterval = setInterval(updateTimer, 1000);
}

// Үгийн сан харуулах
function displayDictionary() {
    dictionaryListEl.innerHTML = "";
    
    vocab.forEach(item => {
        const div = document.createElement("div");
        div.className = "dictionary-item";
        
        const displayWord = convertText(item.word, currentInputType);
        
        div.innerHTML = `
            <span class="japanese">${displayWord}</span> 
            ${currentInputType !== "romaji" ? `(${item.romaji})` : ""} - 
            <span class="mongolian">${item.meaning}</span>
        `;
        
        dictionaryListEl.appendChild(div);
    });
}

// Горимын товчлууруудын үйлдэл
mode1Btn.addEventListener("click", () => {
    currentMode = "mode1";
    mode1Btn.classList.add("active");
    mode2Btn.classList.remove("active");
    startTimer();
    displayQuestion();
});

mode2Btn.addEventListener("click", () => {
    currentMode = "mode2";
    mode2Btn.classList.add("active");
    mode1Btn.classList.remove("active");
    startTimer();
    displayQuestion();
});

// Оролтын төрөл өөрчлөх
inputTypeRadios.forEach(radio => {
    radio.addEventListener("change", function() {
        currentInputType = this.value;
        displayQuestion();
        displayDictionary();
    });
});

// Үгийн сан харуулах/нуух
dictionaryToggleBtn.addEventListener("click", () => {
    if (dictionaryEl.style.display === "none") {
        dictionaryEl.style.display = "block";
        dictionaryToggleBtn.textContent = "Толь нуух";
        displayDictionary();
    } else {
        dictionaryEl.style.display = "none";
        dictionaryToggleBtn.textContent = "Толь харах";
    }
});

// Үгийн санг ачаалах ба тоглоомыг эхлүүлэх
fetch('vocab.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Үгийн санг ачаалж чадсангүй');
        }
        return response.json();
    })
    .then(data => {
        vocab = data;
        startTimer();
        displayQuestion();
    })
    .catch(error => {
        console.error('Алдаа:', error);
        wordEl.textContent = 'Үгийн санг ачаалж чадсангүй. Дахин оролдоно уу.';
    });
