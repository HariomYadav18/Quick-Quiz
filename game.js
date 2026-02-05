const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const timerText = document.getElementById("timer");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let timeLeft = 30;
let timerInterval;
let questions = [];

// Load questions from local JSON file
const loadQuestions = async () => {
  try {
    const response = await fetch('questions.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    questions = data;
    startGame();
  } catch (error) {
    console.error('Error loading questions:', error);
    showErrorMessage('Failed to load questions. Please refresh the page.');
  }
};

// Show error message to user
const showErrorMessage = (message) => {
  // Hide the loader
  loader.classList.add('hidden');

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `
    <h3>Error</h3>
    <p>${message}</p>
    <button onclick="location.reload()" class="btn">Retry</button>
    <a href="index.html" class="btn">Go Home</a>
  `;
  document.querySelector('.container').appendChild(errorDiv);
};

const CORRECT_BONUS = 2;
const MAX_QUESTIONS = 10;

// Initialize the game
loadQuestions();

choices.forEach(choice => {
  choice.addEventListener("click", e => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
      playCorrectSound();
    } else {
      playIncorrectSound();
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

const startGame = () => {
  questionCounter = 0;
  score = 0;
  timeLeft = 30;
  availableQuestions = [...questions];
  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
  startTimer();
};

const getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    clearInterval(timerInterval);
    localStorage.setItem("mostRecentScore", score);
    //go to the end page
    return window.location.assign("end.html");
  }
  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  //progress bar 
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach(choice => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
  resetTimer();
};

// Sound effects (using Web Audio API)
const playCorrectSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.log('Sound not supported');
  }
};

const playIncorrectSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (error) {
    console.log('Sound not supported');
  }
};

const incrementScore = num => {
  score += num;
  scoreText.innerText = score;
};



const startTimer = () => {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerText.innerText = timeLeft;

    // Apply warning classes based on time remaining
    timerText.classList.remove('warning', 'danger');
    if (timeLeft <= 10) {
      timerText.classList.add('danger');
    } else if (timeLeft <= 20) {
      timerText.classList.add('warning');
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeUp();
    }
  }, 1000);
};

const resetTimer = () => {
  clearInterval(timerInterval);
  timeLeft = 30;
  timerText.innerText = timeLeft;
  startTimer();
};

const timeUp = () => {
  acceptingAnswers = false;
  // Show time's up message
  const timeUpMessage = document.createElement('div');
  timeUpMessage.className = 'time-up-message';
  timeUpMessage.innerHTML = '<h3>Time\'s Up!</h3>';
  document.body.appendChild(timeUpMessage);

  setTimeout(() => {
    timeUpMessage.remove();
    getNewQuestion();
  }, 1500);
};




