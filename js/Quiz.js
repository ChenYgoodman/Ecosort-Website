// Quiz Questions
const questions = [
    {
        question: "Which category does an aluminum can belong to?",
        options: ["Recyclables", "Hazardous Waste", "Kitchen Waste", "Other Waste"],
        answer: "Recyclables"
    },
    {
        question: "Where should you dispose of used batteries?",
        options: ["Recyclables", "Hazardous Waste", "Kitchen Waste", "Other Waste"],
        answer: "Hazardous Waste"
    },
    {
        question: "How should fruit peels be classified?",
        options: ["Recyclables", "Hazardous Waste", "Kitchen Waste", "Other Waste"],
        answer: "Kitchen Waste"
    },
    {
        question: "What is the proper category for plastic bags?",
        options: ["Recyclables", "Hazardous Waste", "Kitchen Waste", "Other Waste"],
        answer: "Other Waste"
    },
    {
        question: "Which bin should glass bottles go in?",
        options: ["Recyclables", "Hazardous Waste", "Kitchen Waste", "Other Waste"],
        answer: "Recyclables"
    },
    {
        question: "How should expired medicines be disposed?",
        options: ["Recyclables", "Hazardous Waste", "Kitchen Waste", "Other Waste"],
        answer: "Hazardous Waste"
    },
    {
        question: "What category do tea leaves belong to?",
        options: ["Recyclables", "Hazardous Waste", "Kitchen Waste", "Other Waste"],
        answer: "Kitchen Waste"
    },
    {
        question: "Where should broken ceramics be placed?",
        options: ["Recyclables", "Hazardous Waste", "Kitchen Waste", "Other Waste"],
        answer: "Other Waste"
    },
    {
        question: "How should fluorescent tubes be classified?",
        options: ["Recyclables", "Hazardous Waste", "Kitchen Waste", "Other Waste"],
        answer: "Hazardous Waste"
    },
    {
        question: "What is the proper disposal method for old clothes?",
        options: ["Recyclables", "Hazardous Waste", "Kitchen Waste", "Other Waste"],
        answer: "Recyclables"
    }
];

// Quiz Variables
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 20;
let quizStartTime;
let totalTime = 0;
const leaderboardKey = 'wasteSortingLeaderboard';
const maxLeaderboardEntries = 10;

// DOM Elements
const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');
const leaderboardScreen = document.getElementById('leaderboardScreen');
const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const timerDisplay = document.getElementById('timer');
const questionCount = document.getElementById('questionCount');
const scoreText = document.getElementById('scoreText');
const restartBtn = document.getElementById('restartBtn');
const viewLeaderboardBtn = document.getElementById('viewLeaderboardBtn');
const backToResultsBtn = document.getElementById('backToResultsBtn');
const leaderboardBody = document.getElementById('leaderboardBody');

// Event Listeners
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartQuiz);
viewLeaderboardBtn.addEventListener('click', showLeaderboard);
backToResultsBtn.addEventListener('click', () => {
    leaderboardScreen.style.display = 'none';
    resultScreen.style.display = 'block';
});

// Functions
function startQuiz() {
    quizStartTime = new Date().getTime();
    startScreen.style.display = 'none';
    quizScreen.style.display = 'block';
    showQuestion();
    startTimer();
}

function showQuestion() {
    const question = questions[currentQuestion];
    questionText.textContent = question.question;
    optionsContainer.innerHTML = '';
    
    questionCount.textContent = `Question ${currentQuestion + 1}/${questions.length}`;
    
    question.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectOption(option));
        optionsContainer.appendChild(button);
    });
    
    nextBtn.disabled = true;
    timeLeft = 20;
    timerDisplay.textContent = `${timeLeft}s`;
}

function selectOption(selectedOption) {
    clearInterval(timer);
    
    const options = document.querySelectorAll('.option-btn');
    const correctAnswer = questions[currentQuestion].answer;
    
    options.forEach(option => {
        option.disabled = true;
        
        if (option.textContent === correctAnswer) {
            option.classList.add('selected');
            option.style.borderColor = '#198754';
            option.style.backgroundColor = 'rgba(25, 135, 84, 0.1)';
        }
        
        if (option.textContent === selectedOption && selectedOption !== correctAnswer) {
            option.style.borderColor = '#dc3545';
            option.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
        }
    });
    
    if (selectedOption === correctAnswer) {
        score++;
    }
    
    nextBtn.disabled = false;
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            autoSkipQuestion();
        }
    }, 1000);
}

function autoSkipQuestion() {
    const options = document.querySelectorAll('.option-btn');
    options.forEach(option => option.disabled = true);
    nextBtn.disabled = false;
}

function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
        showQuestion();
        startTimer();
    } else {
        showResults();
    }
}

function showResults() {
    const endTime = new Date().getTime();
    totalTime = Math.floor((endTime - quizStartTime) / 1000); // 计算总秒数
    
    quizScreen.style.display = 'none';
    resultScreen.style.display = 'block';
    scoreText.textContent = `You scored ${score} out of ${questions.length}! Time: ${formatTime(totalTime)}`;
    
    // 保存到排行榜
    saveToLeaderboard(score, totalTime);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
}

function saveToLeaderboard(score, time) {
    let leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
    
    leaderboard.push({
        score: score,
        time: time,
        date: new Date().toLocaleDateString()
    });
    
    // 按分数降序、时间升序排序
    leaderboard.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.time - b.time;
    });
    
    // 只保留前N条记录
    leaderboard = leaderboard.slice(0, maxLeaderboardEntries);
    
    localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));
}

function showLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
    
    leaderboardBody.innerHTML = '';
    
    if (leaderboard.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="4" class="text-center">No records yet</td>';
        leaderboardBody.appendChild(row);
    } else {
        leaderboard.forEach((entry, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${entry.score}/${questions.length}</td>
                <td>${formatTime(entry.time)}</td>
                <td>${entry.date}</td>
            `;
            leaderboardBody.appendChild(row);
        });
    }
    
    resultScreen.style.display = 'none';
    leaderboardScreen.style.display = 'block';
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    totalTime = 0;
    leaderboardScreen.style.display = 'none';
    resultScreen.style.display = 'none';
    startScreen.style.display = 'block';
}