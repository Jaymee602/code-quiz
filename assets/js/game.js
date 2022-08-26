const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');
const progressBarFull = document.querySelector('#progressBarFull');
const timer = document.querySelector("#timer")

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let time = 100;
let penalty = 10;
let questionCounter = 0;
let availableQuestions = [];

function decrementTime(myInterval) {
    time--;
    timer.textContent = time;
    if (time === 0) {
        clearInterval(myInterval)
    }
}

let questions = [
    {
        question: "Inside of which HTML element do we put the JavaScript?",
        choice1: "<javascript>",
        choice2: "<scripting>",
        choice3: "<js>",
        choice4: "<script>",
        answer: 4,

    },
    {
        question: "What is the correct syntax for referring to an external script called 'xxx.js'?",
        choice1: "<script name='xxx.js'>",
        choice2: "<script src='xxx.js'>",
        choice3: "<script href='xxx.js'>",
        choice4: "<script a='xxx.js'>",
        answer: 2,
    },
    {
        question: "How do you create a function in JavaScript?",
        choice1: "function myFunction()",
        choice2: "function:myFunction()",
        choice3: "function = myFunction()",
        choice4: "function.myFunction()",
        answer: 1,
    },
    {
        question: "What special character creates the boiler plate for an html file?",
        choice1: "!",
        choice2: "?",
        choice3: "#",
        choice4: "$",
        answer: 1,
    }
];

const SCORE_POINTS = 100;
const MAX_QUESTIONS = 4;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();

    // start timer
    timer.textContent = time;
    var myInterval = setInterval(() => {
       decrementTime(myInterval);
    }, 1000)
}

getNewQuestion = () => {
    // if there are no more questions then end game and save score to localStorage
    if(availableQuestions.length === 0 || questionCounter > MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        localStorage.setItem('mostRecentTime', time);

        // on game end, take user to the end game page
        return window.location.assign('./end.html');
    };

    questionCounter++;

    // progress text
    progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`;
    // progress bar
    progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100}%`;

    // calculate value of question index
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    // keep track of what question the user is on
    currentQuestion = availableQuestions[questionIndex];
    // display the current question
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        // display each choice
        choice.innerText = currentQuestion['choice' + number];
    })

    availableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return;
        
        // after the user selects an answer, they aren't allowed to pick a different one
        acceptingAnswers = false;
        // the user's selected choice is what the one they clicked on
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        // if the selected answer is correct then add class of correct (green), else add class of incorrect (red)
        let classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        // add points if question was answered correctly
        if(classToApply === 'correct') {
            incrementScore(SCORE_POINTS)
        };

        if(classToApply === "incorrect"){
            deductTime(penalty);
        }

        // indicated which class to apply (correct vs. incorrect)
        selectedChoice.parentElement.classList.add(classToApply);

        // class of correct or incorrect will be removed after 1 second and then the next question will be displayed
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 500)
    });
});

deductTime = num => {
    time -=num;
    timer.innerText = time;
}

incrementScore = num => {
    score +=num;
    scoreText.innerText = score;
};

startGame();