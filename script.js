
const landingScreen = document.getElementById("landing-screen");
const quizScreen = document.getElementById("quiz-screen");
const leaderboardScreen = document.getElementById("leaderboard-screen");
const resultScreen = document.getElementById("result-screen");
const nextBtn = document.getElementById('next-btn')

let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let playerName = "";
let selectedCategory = "";
let timerInterval = null;

const startButton = document.getElementById("start-btn");
const homeButton = document.getElementById("home-btn");
const playAgainButton = document.getElementById("play-again-btn");
const leaderboardButton = document.getElementById("leaderboard-btn");
const backHomeButton = document.getElementById("back-home-btn");


  function showScreen(screenName){
   [landingScreen, quizScreen, resultScreen, leaderboardScreen].forEach(screen => {
  screen.classList.add('hidden')
})

    if(screenName === "landing"){
      landingScreen.classList.remove("hidden");
    }
    else if(screenName === "quiz"){
        quizScreen.classList.remove("hidden");
  }
    else if(screenName === "leaderboard"){
        leaderboardScreen.classList.remove("hidden");
  }
    else if(screenName === "result"){
        resultScreen.classList.remove("hidden");
  }
    }

startButton.addEventListener("click", () => {
     playerName = document.getElementById('player-name').value;
     if(!playerName){
      alert("Please enter your name!")
      return;
     }
    const categoryInput = document.querySelector('input[name="category"]:checked');
    if (!categoryInput) {
        alert('Please select a category!')
    return
}
    selectedCategory = categoryInput.value;
    score = 0
    currentIndex = 0
    document.getElementById('live-score').textContent = 'Score: 0' 
    const filtered = allQuestions.filter(q => q.category === categoryInput.value);

    for(let i= filtered.length - 1; i>=0;i--){
      const j = Math.floor(Math.random() * (i + 1));
      let temp = filtered[i];
      filtered[i] = filtered[j];
      filtered[j] = temp;
    }

   currentQuestions = filtered.slice(0, 10);
  console.log(currentQuestions);
    showScreen("quiz");
    loadQuestion(0);
});

homeButton.addEventListener("click", () => {
  score = 0;
  showScreen("landing");
});

backHomeButton.addEventListener("click", () => {
  score = 0;
  showScreen("landing");
});

leaderboardButton.addEventListener("click", () => {
    showScreen("leaderboard");
    renderLeaderboard();
});

playAgainButton.addEventListener('click', function() {
  // TODO: restart quiz with same category
  score = 0;
  currentIndex = 0;
  document.getElementById('live-score').textContent = 'Score: 0';
  const filtered = allQuestions.filter(q => q.category === selectedCategory)
  
  for (let i = filtered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    let temp = filtered[i]
    filtered[i] = filtered[j]
    filtered[j] = temp
  }
  
  currentQuestions = filtered.slice(0,10);

  showScreen('quiz');
  loadQuestion(0);
})


document.getElementById("clear-leaderboard-btn").addEventListener('click',()=>{
  localStorage.removeItem("cricketBrainScores");
  renderLeaderboard();
})

function loadQuestion(index) {
   currentIndex = index;
  const optionButtons = document.querySelectorAll('.option-btn');
  optionButtons.forEach(btn => {
    btn.classList.remove('correct', 'wrong')
    btn.disabled = false
    btn.onclick = null 
  })

  document.getElementById('timer-display').classList.remove('danger');

  // reset explanation
  const explanationText = document.getElementById('explanation-text')
  explanationText.classList.add('hidden')
  explanationText.textContent = ''

  // get the current question from currentQuestions array
  const currentQuestion = currentQuestions[index];
  
  // put question text into #question-text
  const questionText = document.getElementById("question-text");
  questionText.textContent = currentQuestion.question;
  
  // put 4 options into the 4 option buttons
  // const optionButtons = document.querySelectorAll(".option-btn");
   // set option text AND onclick in same loop
  optionButtons.forEach((btn, i) => {
    btn.textContent = currentQuestion.options[i]

    btn.onclick = () => {
      const selectedAnswer = btn.textContent

      // correct answer
      if (selectedAnswer === currentQuestion.answer) {
        btn.classList.add('correct')
        score += 1
        document.getElementById('live-score').textContent = `Score: ${score}`
      } 
      // wrong answer
      else {
        btn.classList.add('wrong')
        optionButtons.forEach(b => {
          if (b.textContent === currentQuestion.answer) {
            b.classList.add('correct')
          }
        })
      }

      // disable all buttons
      optionButtons.forEach(b => b.disabled = true)

      clearInterval(timerInterval)
      document.getElementById('timer-display').classList.remove('danger')

      // show explanation
      explanationText.textContent = currentQuestion.explanation
      explanationText.classList.remove('hidden')

      // after 1.5 seconds load next or show result
     if (index + 1 === 10) {
        nextBtn.textContent = 'See Results →'
} 
      else {
        nextBtn.textContent = 'Next Question →'
    }
      nextBtn.classList.remove('hidden')
      nextBtn.onclick = () => {
        nextBtn.classList.add('hidden')
        explanationText.classList.add('hidden')
        if (index + 1 === 10) {
          showResult()
        } else {
          loadQuestion(index + 1)
        }
}
    }
  })

  
  // update question counter — "Q1 of 10"
  const questionCounter = document.getElementById("question-counter");
  questionCounter.textContent = `Q${index + 1} of ${currentQuestions.length}`;

  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = ((index / 10) * 100) + "%";
  
  // update category label
  const categoryLabel = document.getElementById("current-category");
  categoryLabel.textContent = selectedCategory;

  startTimer();
}

function startTimer(){
  clearInterval(timerInterval);

  let timeLeft = 15;

  document.getElementById("timer-display").textContent = `⏱ ${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft -= 1;

    document.getElementById("timer-display").textContent = `⏱ ${timeLeft}s`;

    if(timeLeft <= 5){
      document.getElementById("timer-display").classList.add("danger");
    }

    if(timeLeft === 0){
      clearInterval(timerInterval);
      document.getElementById("timer-display").classList.remove("danger");

      const optionButtons = document.querySelectorAll(".option-btn");
      optionButtons.forEach(b => b.disabled = true);

      optionButtons.forEach(b => {
        if(b.textContent === currentQuestions[currentIndex].answer){
          b.classList.add('correct');
        }
      });

      const explanationText = document.getElementById('explanation-text');
      explanationText.textContent = currentQuestions[currentIndex].explanation;
      explanationText.classList.remove('hidden');

      if(currentIndex + 1 === 10){
        nextBtn.textContent = 'See Results →';
      } else {
        nextBtn.textContent = 'Next Question →';
      }

      nextBtn.classList.remove('hidden');

      nextBtn.onclick = () => {
        nextBtn.classList.add('hidden');
        explanationText.classList.add('hidden');
        if(currentIndex + 1 === 10){
          showResult();
        } else {
          loadQuestion(currentIndex + 1);
        }
      }

    } // closes if(timeLeft===0)

  }, 1000); // closes setInterval

} // closes startTimer


function showResult(){
  clearInterval(timerInterval);

  showScreen('result');

  document.getElementById('final-score').textContent = score;

  document.getElementById('correct-count').textContent = `✅ Correct: ${score}`;
  document.getElementById('wrong-count').textContent = `❌ Wrong: ${10 - score}`;

  let message = '';
  if(score<=3){
    message = "Caught at slip! 😬 Better luck next time";
  }
  else if(score>3 && score<=6){
    message =  "Decent knock 🏏 Room for improvement";
  }
  else if(score>6 && score<=8){
    message = "Half century! 🌟 You know your cricket";
  }
  else{
    message = "CENTURY! 🏆 You're a cricket genius!";
  }

  document.getElementById('performance-message').textContent = message;

  const entry = {
    name: playerName,
    score: score,
    category: selectedCategory,
    date : new Date().toLocaleDateString()
  }

  const existingScores = JSON.parse(localStorage.getItem('cricketBrainScores')) || [];

  existingScores.push(entry);

  localStorage.setItem('cricketBrainScores', JSON.stringify(existingScores));

}

function renderLeaderboard(){
  const allScores = JSON.parse(localStorage.getItem('cricketBrainScores')) || [];

  allScores.sort((a,b) => b.score - a.score);

  const top5 = allScores.slice(0,5);

  const leadeboardBody = document.getElementById("leaderboard-body");
  leadeboardBody.innerHTML = '';
  
   if (top5.length === 0) {
    leaderboardBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding:1.5rem; color:var(--text-secondary)">
          No Scores Yet. Play a Game first! 🏏
        </td>
      </tr>`
    return
  }

top5.forEach((entry,index) => {
  const row = document.createElement('tr');
   row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.name}</td>
      <td>${entry.score}/10</td>
      <td>${entry.category}</td>
      <td>${entry.date}</td>
    `;
    leadeboardBody.appendChild(row);
})
}
