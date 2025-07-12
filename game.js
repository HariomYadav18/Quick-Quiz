let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let timeLeft = 30;
let timerInterval;
let questions = [];

// DOM elements (will be initialized when DOM is ready)
let question, choices, progressText, scoreText, timerText, progressBarFull, game;

// Initialize DOM elements
const initializeElements = () => {
  question = document.getElementById("question");
  choices = Array.from(document.getElementsByClassName("choice-text"));
  progressText = document.getElementById("progressText");
  scoreText = document.getElementById("score");
  timerText = document.getElementById("timer");
  progressBarFull = document.getElementById("progressBarFull");
  game = document.getElementById("game");
  
  console.log('Elements initialized');
  console.log('question:', question);
  console.log('scoreText:', scoreText);
  console.log('timerText:', timerText);
  console.log('progressText:', progressText);
  console.log('progressBarFull:', progressBarFull);
  console.log('choices:', choices.length);
  
  // Check if all elements are found
  if (!question || !scoreText || !timerText || !progressText || !progressBarFull || choices.length === 0) {
    console.error('Some elements not found!');
    console.error('question:', !!question);
    console.error('scoreText:', !!scoreText);
    console.error('timerText:', !!timerText);
    console.error('progressText:', !!progressText);
    console.error('progressBarFull:', !!progressBarFull);
    console.error('choices:', choices.length);
  }
};

// Load questions from local JSON file
const loadQuestions = async () => {
  try {
    console.log('loadQuestions started');
    
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

const CORRECT_BONUS = 2;
const MAX_QUESTIONS = 10;

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded');
  initializeElements();
  
  // Wait a bit and try again if elements aren't found
  setTimeout(() => {
    if (!question || !scoreText || !timerText) {
      console.log('Retrying element initialization...');
      initializeElements();
    }
    
    if (question && scoreText && timerText) {
      setupEventListeners();
      loadQuestions();
    } else {
      console.error('Critical elements still not found after retry');
      showErrorMessage('Failed to initialize game elements. Please refresh the page.');
    }
  }, 100);
});

// Setup event listeners for choices
const setupEventListeners = () => {
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
        // Add celebration emoji
        const celebration = document.createElement('div');
        celebration.innerHTML = '🎉';
        celebration.style.position = 'fixed';
        celebration.style.top = '50%';
        celebration.style.left = '50%';
        celebration.style.transform = 'translate(-50%, -50%)';
        celebration.style.fontSize = '5rem';
        celebration.style.zIndex = '1000';
        celebration.style.animation = 'bounce 1s ease-out';
        celebration.style.pointerEvents = 'none';
        document.body.appendChild(celebration);
        
        setTimeout(() => celebration.remove(), 1000);
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
};

const startGame = () => {
    console.log('startGame called');
    
    questionCounter = 0;
    score = 0;
    timeLeft = 30;
    availableQuestions = [...questions];
    getNewQuestion();
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
    
    // Safety checks for DOM elements
    if (progressText) {
        progressText.innerText = `❓ Question ${questionCounter}/${MAX_QUESTIONS}`;
    }
    
    if (progressBarFull) {
        progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100}%` ;
    }
    
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    
    if (question) {
        question.innerText = currentQuestion.question;
        
        // Add question animation
        question.style.animation = 'none';
        question.offsetHeight; // Trigger reflow
        question.style.animation = 'slideInLeft 0.6s ease-out';
    }
  
    if (choices && choices.length > 0) {
        choices.forEach(choice => {
          const number = choice.dataset["number"];
          choice.innerText = currentQuestion["choice" + number];
        });
    }
  
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
    
    if (scoreText) {
        scoreText.innerText = score;
        
        // Add score animation
        scoreText.style.animation = 'none';
        scoreText.offsetHeight; // Trigger reflow
        scoreText.style.animation = 'bounce 0.6s ease-out';
        
        // Create particle effect
        createParticles(scoreText);
    }
    
    // Special effect for high scores
    if (score >= 10) {
        createConfetti();
    }
};

// Create confetti effect
const createConfetti = () => {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FF8C42'];
    const emojis = ['🎉', '🎊', '⭐', '🏆', '💎', '🌟'];
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-50px';
        confetti.style.fontSize = '2rem';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        confetti.style.animation = `particle ${2 + Math.random() * 2}s ease-out forwards`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 4000);
    }
};

// Timer functions
const startTimer = () => {
    // Clear any existing timer first
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
      timeLeft--;
      
      if (timerText) {
          timerText.innerText = timeLeft;
          
          // Add warning effects
          if (timeLeft <= 10) {
            timerText.classList.add('danger');
          } else if (timeLeft <= 20) {
            timerText.classList.add('warning');
          }
      }
      
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timeUp();
      }
    }, 1000); // 1000ms = 1 second
};

const resetTimer = () => {
    // Clear existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Reset timer state
    timeLeft = 30;
    
    if (timerText) {
        timerText.innerText = timeLeft;
        timerText.classList.remove('warning', 'danger');
    }
    
    // Start new timer
    startTimer();
};

const timeUp = () => {
    acceptingAnswers = false;
    // Show time's up message
    const timeUpMessage = document.createElement('div');
    timeUpMessage.className = 'time-up-message';
    timeUpMessage.innerHTML = '<h3>⏰ Time\'s Up!</h3>';
    document.body.appendChild(timeUpMessage);
    
    // Add shake animation to timer
    if (timerText) {
        timerText.style.animation = 'shake 0.5s ease-in-out';
    }
    
    setTimeout(() => {
      timeUpMessage.remove();
      if (timerText) {
          timerText.style.animation = '';
      }
      getNewQuestion();
    }, 1500);
};

// Create particle effects
const createParticles = (element) => {
    const rect = element.getBoundingClientRect();
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = rect.left + rect.width / 2 + 'px';
        particle.style.top = rect.top + rect.height / 2 + 'px';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        particle.style.animation = `particle 1s ease-out forwards`;
        
        document.body.appendChild(particle);
        
        // Random direction
        const angle = (Math.PI * 2 * i) / 5;
        const velocity = 50 + Math.random() * 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        particle.style.setProperty('--vx', vx + 'px');
        particle.style.setProperty('--vy', vy + 'px');
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
};
  


