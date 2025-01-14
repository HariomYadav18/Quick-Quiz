const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const questionCounterText = document.getElementById('questionCounterText');
const scoreText = document.getElementById('scoreText');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];


let questions = [
    {
        question: "Q. Which of the following is a key feature of the ECMAScript 6 (ES6) specification?",
        choice1: "Promises ",
        choice2: "Callbacks",
        choice3: "AJAX",
        choice4: "jQuery",
        answer: 1
    },

    {
        question: "Q. In the context of RESTful APIs, what does the term 'idempotent' refer to?",
        choice1: "A method that can be called multiple times without different outcomes ",
        choice2: "A method that requires authentication",
        choice3: "A method that modifies server state",
        choice4: "A method that returns data in JSON format",
        answer: 1
    },

    {
        question: "Q. Which of the following is a primary benefit of using TypeScript over JavaScript?",
        choice1: "It is faster than JavaScript",
        choice2: "It provides static typing ",
        choice3: "It eliminates the need for frameworks",
        choice4: "It is exclusively for back-end development",
        answer: 2
    },

    {
        question: "Q. What is the purpose of middleware in an Express.js application?",
        choice1: "To manage database connections",
        choice2: "To handle routing logic",
        choice3: "To process requests and responses",
        choice4: "To serve static files",
        answer: 3
    },

    {
        question: "Q. Which SQL command is used to remove a table from a database?",
        choice1: "DELETE TABLE",
        choice2: "DROP TABLE",
        choice3: "REMOVE TABLE",
        choice4: "TRUNCATE TABLE",
        answer: 2
    },

    {
        question: "Q. In MongoDB, what is the purpose of an index?",
        choice1: "To enforce data integrity",
        choice2: "To speed up query performance",
        choice3: "To store large amounts of data",
        choice4: "To create relationships between collections",
        answer: 2
    },
    
    {
        question: "Q. What does CORS stand for, and why is it important in web development?",
        choice1: "Cross-Origin Resource Sharing; it allows or restricts resources from being requested from another domain",
        choice2: "Cross-Origin Request Security; it secures data transmission between servers",
        choice3: "Common Origin Resource Sharing; it standardizes API requests",
        choice4: "Cross-Origin Response Sharing; it manages response headers",
        answer: 1
    },

    {
        question: "Q. Which of the following technologies is commonly used for real-time web applications?",
        choice1: "REST APIs",
        choice2: "AJAX polling",
        choice3: "GraphQL",
        choice4: "WebSockets ",
        answer: 4
    },

    {
        question: "Q. What is the primary function of Docker in modern web development?",
        choice1: "To manage databases",
        choice2: "To create virtual machines",
        choice3: "To containerize applications for consistent deployment",
        choice4: "To serve static files",
        answer: 3
    },

    {
        question: "Q. In GraphQL, what is the purpose of a resolver?",
        choice1: "To define the schema of the API",
        choice2: "To handle authentication and authorization",
        choice3: "To manage subscriptions in real-time applications",
        choice4: "To fetch and return data for queries and mutations",
        answer: 4
    }
    
]

const CORRECT_BONUS = 2;
const MAX_QUESTIONS = 10;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
};

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        //go to the end page
        return window.location.assign("/end.html");
    }
    questionCounter++;
    questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply = 
         selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";


        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        },1000);

        });

        
        

    });


startGame();

