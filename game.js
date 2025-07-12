let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let timeLeft = 30;
let timerInterval;
let questions = [];

// DOM elements (will be initialized when DOM is ready)
let question, choices, progressText, scoreText, timerText, progressBarFull, loader, game;

// Initialize DOM elements
const initializeElements = () => {
  question = document.getElementById("question");
  choices = Array.from(document.getElementsByClassName("choice-text"));
  progressText = document.getElementById("progressText");
  scoreText = document.getElementById("score");
  timerText = document.getElementById("timer");
  progressBarFull = document.getElementById("progressBarFull");
  loader = document.getElementById("loader");
  game = document.getElementById("game");
  
  console.log('Elements initialized:');
  console.log('loader:', loader);
  console.log('game:', game);
};

// Load questions from local JSON file
const loadQuestions = async () => {
  try {
    console.log('loadQuestions started');
    
    // Ensure loader is visible and game is hidden
    if (loader) {
        loader.classList.remove("hidden");
        console.log('Loader shown');
    }
    if (game) {
        game.classList.add("hidden");
        console.log('Game hidden');
    }
    
    const response = await fetch('questions.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    questions = data;
    console.log('Questions loaded:', questions.length);
    startGame();
  } catch (error) {
    console.error('Error loading questions:', error);
    showErrorMessage('Failed to load questions. Please refresh the page.');
  }
};

// Show error message to user
const showErrorMessage = (message) => {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `
    <h3>Error</h3>
    <p>${message}</p>
    <button onclick="location.reload()" class="btn">Retry</button>
  `;
  document.body.appendChild(errorDiv);
};

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initializeElements();
  loadQuestions();
});

const CORRECT_BONUS = 2;
const MAX_QUESTIONS = 10;

startGame = () => {
    console.log('startGame called');
    console.log('loader element:', loader);
    console.log('game element:', game);
    
    questionCounter = 0;
    score = 0;
    timeLeft = 30;
    availableQuestions = [...questions];
    getNewQuestion();
    
    // Hide loader and show game
    if (loader) {
        loader.classList.add("hidden");
        console.log('Loader hidden');
    } else {
        console.error('Loader element not found!');
        // Fallback: try to find loader again
        const loaderFallback = document.getElementById("loader");
        if (loaderFallback) {
            loaderFallback.classList.add("hidden");
            console.log('Loader hidden via fallback');
        }
    }
    
    if (game) {
        game.classList.remove("hidden");
        console.log('Game shown');
    } else {
        console.error('Game element not found!');
        // Fallback: try to find game again
        const gameFallback = document.getElementById("game");
        if (gameFallback) {
            gameFallback.classList.remove("hidden");
            console.log('Game shown via fallback');
        }
    }
    
    startTimer();
};
  
  getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
      clearInterval(timerInterval);
      localStorage.setItem("mostRecentScore", score);
      //go to the end page
      return window.location.assign("end.html");
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //progress bar 
    progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100}%` ;
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
  
  incrementScore = num => {
    score += num;
    scoreText.innerText = score;
  };

  // Timer functions
  startTimer = () => {
    timerInterval = setInterval(() => {
      timeLeft--;
      timerText.innerText = timeLeft;
      
      // Add warning effects
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

  resetTimer = () => {
    clearInterval(timerInterval);
    timeLeft = 30;
    timerText.innerText = timeLeft;
    timerText.classList.remove('warning', 'danger');
    startTimer();
  };

  timeUp = () => {
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
  


