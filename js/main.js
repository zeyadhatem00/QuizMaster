import { levelVALUE, roundsVALUE, typeVALUE } from "./ui-controls.js";

const startbrn = document.getElementById("startQuiz");
const contentContainer = document.getElementById("quizOptions");
const main = document.querySelector("main");
export const formerror = document.getElementById("formerror");
let Questions;
let number = 1;
let index = 0;
let score = 0;
let timer;
let timeLeft;
let correctone;
let wrongone;
let users = [];
const name = document.getElementById("playerName");
let playerName = "player";
let ranklist = "";
let rank = 0;
let againbtn;
let tryagainbtn;
const correctsound = document.getElementById("correct");
const incorrectsound = document.getElementById("incorrect");
const results = document.getElementById("results");
let questionAnswered = false;
const countdown = document.getElementById("countdown");

//**************************************************************** */

if (localStorage.getItem("playerslist") !== null) {
  JSON.parse(localStorage.getItem("playerslist")).sort(
    (a, b) => b.score - a.score,
  );
  users = JSON.parse(localStorage.getItem("playerslist"));
}

//*******************START*************************** */

name.addEventListener("input", () => {
  playerName = name.value;
});

startbrn.addEventListener("click", () => {
  if (roundsVALUE == 0 || "" || null) {
    formerror.classList.remove("hidden");
  } else {
    formerror.classList.add("hidden");
    main.innerHTML = `  <div class="loading-overlay">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading Questions...</p>
    </div>`;
    apiCALL();
  }
});

async function apiCALL() {
  try {
    let req = await fetch(
      `https://opentdb.com/api.php?amount=${roundsVALUE}&category=${typeVALUE}&difficulty=${levelVALUE}`,
    );
    let response = await req.json();
    Questions = response.results;
    console.log(response);
    displayQuestions();
  } catch (error) {
    main.innerHTML = ` <div class="game-card error-card">
      <div class="error-icon">
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
      <h3 class="error-title">Oops! Something went wrong</h3>
      <p class="error-message">Failed to load questions. Please try again.</p>
      <button onclick="tryagain()" class="btn-play retry-btn">
        <i class="fa-solid fa-rotate-right"></i> Try Again
      </button>
    </div>`;
    tryagainbtn = document.querySelector(".retry-btn");
  }
}

//**************************DISPLAY**************************** */

function displayQuestions() {
  let allanswers = [
    Questions[index].correct_answer,
    ...Questions[index].incorrect_answers,
  ];
  let buttons = "";

  const answers = shuffle([
    Questions[index].correct_answer,
    ...Questions[index].incorrect_answers,
  ]);

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));

      [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }

    return array;
  }

  answers.forEach((answer, i) => {
    buttons += `
    <button class="answer-btn" data-answer="${answer}">
      <span class="answer-key">${i + 1}</span>
      <span class="answer-text">${answer}</span>
    </button>
  `;
  });

  let cart = "";
  cart = ` <div class="game-card question-card">
      
      <div class="xp-bar-container">
        <div class="xp-bar-header">
          <span class="xp-label"><i class="fa-solid fa-bolt"></i> Progress</span>
          <span class="xp-value">Question ${number}/${roundsVALUE}</span>
        </div>
        <div class="xp-bar">
          <div class="xp-bar-fill" style="width:${(number / roundsVALUE) * 100}%"></div>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-badge category">
          <i class="fa-solid fa-bookmark"></i>
          <span>${Questions[index].category}</span>
        </div>
        <div class="stat-badge difficulty ${difficultylevel(levelVALUE)}">
          <i class="fa-solid  ${difficultylevelface(levelVALUE)}  "></i>
          <span>${Questions[index].difficulty}</span>
        </div>
        <div class="stat-badge timer">
          <i class="fa-solid fa-stopwatch"></i>
          <span class="timer-value">${timeLeft}</span>s
        </div>
        <div class="stat-badge counter">
          <i class="fa-solid fa-gamepad"></i>
          <span>${number}/${roundsVALUE}</span>
        </div>
      </div>

      <h2 class="question-text">${Questions[index].question}</h2>

      <div class="answers-grid">
      ${buttons}
      </div>

      <p class="keyboard-hint">
        <i class="fa-regular fa-keyboard"></i> Press 1-4 to select
      </p>
   <div class="time-up-message hidden ">
      <i class="fa-solid fa-clock"></i> TIME'S UP!
    </div>
      <div class="score-panel">
        <div class="score-item">
          <div class="score-item-label">Score</div>
          <div class="score-item-value">${score}</div>
        </div>
      </div>
    </div>`;
  main.innerHTML = cart;
  startTimer();
  let btns = Array.from(document.querySelectorAll(".answer-btn"));

  btns.forEach((button) => {
    button.addEventListener("click", () => {
      clearInterval(timer);

      btns.forEach((btn) => {
        if (btn === button) return;

        if (btn.dataset.answer !== Questions[index].correct_answer) {
          btn.classList.add("disabled");
        }
      });

      if (button.dataset.answer === Questions[index].correct_answer) {
        score++;
        button.classList.add("correct");
        correctsound.currentTime = 0;
        correctsound.play();
      } else {
        button.classList.add("wrong");
        incorrectsound.currentTime = 0;
        incorrectsound.play();
        const correctButton = btns.find(
          (btn) => btn.dataset.answer === Questions[index].correct_answer,
        );

        correctButton.classList.add("correct");
      }

      setTimeout(() => {
        nextQuestion();
      }, 1000);
    });
  });

  let questionAnswered = false;
}

window.difficultylevel = function (level) {
  switch (level) {
    case "easy":
      return "easy";

    case "medium":
      return "medium";

    case "hard":
      return "hard";

    default:
      return "";
  }
};

window.difficultylevelface = function (level) {
  switch (level) {
    case "easy":
      return "fa-face-smile";

    case "medium":
      return "fa-face-meh";

    case "hard":
      return "fa-skull";

    default:
      return "";
  }
};

//****************************timer********************* */

function startTimer() {
  clearInterval(timer);

  timeLeft = 15;

  document.querySelector(".timer-value").textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;

    document.querySelector(".timer-value").textContent = timeLeft;

    const clock = document.querySelector(".timer");
    if (timeLeft <= 5) {
      clock.classList.add("warning");
      countdown.currentTime = 1;
      countdown.play();
    }
    if (timeLeft <= 0) {
      countdown.pause();
      clearInterval(timer);

      const btns = [...document.querySelectorAll(".answer-btn")];

      btns.forEach((btn) => {
        if (btn.dataset.answer !== Questions[index].correct_answer) {
          btn.classList.add("disabled");
        }
      });

      const correctButton = btns.find(
        (btn) => btn.dataset.answer === Questions[index].correct_answer,
      );

      correctButton.classList.add("correct");

      incorrectsound.currentTime = 0;
      incorrectsound.play();

      const message = document.querySelector(".time-up-message");
      message.classList.remove("hidden");

      setTimeout(() => {
        nextQuestion();
      }, 2000);
    }
  }, 1000);
}

function nextQuestion() {
  index++;
  number++;

  if (index >= Questions.length) {
    results.currentTime = 0.5;
    results.play();
    leadbaord();
    return;
  }

  displayQuestions();
}

function leadbaord() {
  let userdata = {
    name: playerName,
    score: Math.round((score / roundsVALUE) * 100),
  };

  users.push(userdata);
  users.sort((a, b) => b.score - a.score);
  localStorage.setItem("playerslist", JSON.stringify(users));

  for (let i = 0; i < users.length; i++) {
    rank++;
    ranklist += `   <li class="leaderboard-item gold">
            <span class="leaderboard-rank">#${rank}</span>
            <span class="leaderboard-name">${users[i].name}</span>
            <span class="leaderboard-score">${users[i].score}%</span>
          </li>`;
  }

  main.innerHTML = ` <div class="game-card results-card">
      <h2 class="results-title">Quiz Complete!</h2>
      <p class="results-score-display">${score} / ${roundsVALUE}</p>
      <p class="results-percentage">${Math.round((score / roundsVALUE) * 100)}% Accuracy</p>
       
      <div class="leaderboard">
        <h4 class="leaderboard-title">
          <i class="fa-solid fa-trophy"></i> Leaderboard
        </h4>
        <ul class="leaderboard-list">
       ${ranklist}
        </ul>
      </div>
      
      <div class="action-buttons">
        <button onclick="playagain()" class="btn-restart">
          <i class="fa-solid fa-rotate-right"></i> Play Again
        </button>
      </div>
    </div>`;
  againbtn = document.querySelector(".btn-restart");
}

window.playagain = function () {
  againbtn.innerHTML = `<span class="loader"></span> Play Again`;
  setTimeout(() => {
    location.reload();
  }, 1000);
};
window.tryagain = function () {
  tryagainbtn.innerHTML = `<span class="loader"></span> Try Again`;
  setTimeout(() => {
    location.reload();
  }, 1000);
};

document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(e) {
  if (questionAnswered) return;

  const btns = [...document.querySelectorAll(".answer-btn")];

  const key = Number(e.key);

  if (key >= 1 && key <= btns.length) {
    btns[key - 1].click();
  }
}
