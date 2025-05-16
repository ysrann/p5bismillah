const board = document.getElementById("board");
const rollDiceBtn = document.getElementById("rollDice");
const diceResult = document.getElementById("diceResult");
const currentPlayerText = document.getElementById("currentPlayer");
const questionBox = document.getElementById("questionBox");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("options");
const timerEl = document.getElementById("timer");

let positions = [1, 1];
let currentPlayer = 0;
let isQuestionActive = false;
let timer;

const questionTiles = [5, 13, 21, 34, 46, 52, 65, 73, 84, 91];
const questions = [
  {
    q: "Apa ibu kota Indonesia?",
    a: "Jakarta",
    options: ["Surabaya", "Bandung", "Jakarta"]
  },
  {
    q: "Pulau terbesar di Indonesia?",
    a: "Kalimantan",
    options: ["Bali", "Kalimantan", "Sumatera"]
  },
  // Tambahkan lebih banyak pertanyaan jika perlu
];

function createBoard() {
  for (let i = 100; i >= 1; i--) {
    const cell = document.createElement("div");
    cell.id = `cell-${i}`;
    cell.innerText = i;
    if (questionTiles.includes(i)) cell.classList.add("question");
    board.appendChild(cell);
  }
  updatePawns();
}

function rollDice() {
  if (isQuestionActive) return;
  const dice = Math.floor(Math.random() * 6) + 1;
  diceResult.innerText = `🎲 ${dice}`;
  movePawn(dice);
}

function movePawn(steps) {
  let newPosition = positions[currentPlayer] + steps;
  if (newPosition > 100) newPosition = 100;
  positions[currentPlayer] = newPosition;
  updatePawns();

  if (questionTiles.includes(newPosition)) {
    askQuestion();
  } else {
    switchTurn();
  }
  checkWin();
}

function updatePawns() {
  document.querySelectorAll(".pion").forEach(p => p.remove());
  positions.forEach((pos, i) => {
    const cell = document.getElementById(`cell-${pos}`);
    const pion = document.createElement("div");
    pion.classList.add("pion", `p${i + 1}`);
    cell.appendChild(pion);
  });
}

function switchTurn() {
  currentPlayer = 1 - currentPlayer;
  currentPlayerText.innerText = `Pemain ${currentPlayer + 1}`;
}

function askQuestion() {
  isQuestionActive = true;
  const q = questions[Math.floor(Math.random() * questions.length)];
  questionText.innerText = q.q;
  optionsContainer.innerHTML = "";
  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.onclick = () => checkAnswer(option, q.a);
    optionsContainer.appendChild(btn);
  });
  questionBox.classList.remove("hidden");
  startTimer();
}

function checkAnswer(selected, correct) {
  stopTimer();
  if (selected !== correct) positions[currentPlayer] -= 3;
  if (positions[currentPlayer] < 1) positions[currentPlayer] = 1;
  updatePawns();
  questionBox.classList.add("hidden");
  isQuestionActive = false;
  switchTurn();
}

function startTimer() {
  let timeLeft = 10;
  timerEl.innerText = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerEl.innerText = timeLeft;
    if (timeLeft === 0) {
      stopTimer();
      positions[currentPlayer] -= 3;
      if (positions[currentPlayer] < 1) positions[currentPlayer] = 1;
      updatePawns();
      questionBox.classList.add("hidden");
      isQuestionActive = false;
      switchTurn();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function checkWin() {
  if (positions[currentPlayer] === 100) {
    alert(`Pemain ${currentPlayer + 1} menang!`);
    rollDiceBtn.disabled = true;
  }
}

rollDiceBtn.addEventListener("click", rollDice);
createBoard();
