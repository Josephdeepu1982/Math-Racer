/*-------------------------------- Constants --------------------------------*/
const difficultyEasy = ['+']
const difficultyMedium = ['+','-']
const difficultyHard = ['+','-','*']

/*-------------------------------- Variables --------------------------------*/
let showLandingPage = true;
let showInstructionsPage = false;
let showGamePage = false;
let displaySummaryPage = false;
let playerName = '';
let isDifficultyEasy = false;
let isDifficultyMedium = false;
let isDifficultyHard = false;
let currentLevel = 1;
let operators = [];
let question;
let correctAnswer;
let playerAnswer;
let isCollision = false;
let score = 0;
let lives = 3;
let currentStreak = 0;
let startAnimation;
let timeLeft = 60;
let paused = false;
let correctAnswers = [];
let wrongAnswers = []
let gameOver = false;
let countdownTimerId;

/*------------------------ Cached Element References ------------------------*/
const difficultySelectElement = document.getElementById("difficulty");
const landingPage = document.getElementById("landing-page");
const instructionsPage = document.getElementById("instructions-page" );
const gamePage = document.getElementById("game-page") 
const playerNameInputElement = document.getElementById('playerName')
const namePlayer = document.getElementById("namePlayer")
const startInstructionsBtnElement = document.getElementById('startInstructionsBtn')
const startGameBtnElement = document.getElementById('start-game');
const questionParagraphElement = document.getElementById("Question")
const scoreElement = document.getElementById("score")
const currentStreakElement = document.getElementById("winning-streak")
const timerElement = document.getElementById("timer");
const livesElement = document.getElementById("lives");
const pauseBtnElement = document.getElementById("pauseBtn");
const resetBtnElement = document.getElementById("resetBtn");
const quitBtnElement = document.getElementById("quitBtn");
const summaryPage = document.getElementById("summary-page");
const totalPoints = document.getElementById("total-points");
const correctAnswersList = document.getElementById('correct-answers-list');
const wrongAnswersList = document.getElementById('wrong-answers-list');
const restartButtonElement = document.getElementById("restartBtn");
const homePageBtnElement = document.getElementById("homePageBtn");

/*-------------------------------- Functions --------------------------------*/

//function to hide/show pages 
function loadSite(){
    if (showLandingPage){
        landingPage.style.display = 'block';
        instructionsPage.style.display = 'none';
        gamePage.style.display = 'none';
        summaryPage.style.display = 'none';
    } else if (showInstructionsPage){
        landingPage.style.display = 'none';
        instructionsPage.style.display = 'block';
        gamePage.style.display = 'none';
        summaryPage.style.display = 'none';
    } else if(showGamePage){
        landingPage.style.display = 'none';
        instructionsPage.style.display = 'none';
        gamePage.style.display = 'block';
        summaryPage.style.display = 'none';
    } else if(displaySummaryPage){
        landingPage.style.display = 'none';
        instructionsPage.style.display = 'none';
        gamePage.style.display = 'none';
        summaryPage.style.display = 'block';
    }
  }
  loadSite(); //load site based on flags above


//Capture & format Player Name, sets the Difficulty level & load instructions screen
handlePlayerInput = () => {
  const nameInput = playerNameInputElement.value

  let formattedName = nameInput.trim().toLowerCase().replace(/^\w/,c  => c.toUpperCase());
    if (formattedName === '') {
      formattedName = 'Racer'
    } else {
    playerName = formattedName;}
    namePlayer.textContent = formattedName;
    console.log(formattedName)

    //update page loading flags
    showInstructionsPage = true;
    showLandingPage = false;
    showGamePage = false;
    displaySummaryPage = false;

    diffcultySelected()
    loadSite();
    return;
};

//Sets math operators (Copy arrays) based on difficulty selected
function diffcultySelected(){
  if (difficultySelectElement.value === "easy"){
    operators = [...difficultyEasy];
  } else if (difficultySelectElement.value === "medium"){
    operators = [...difficultyMedium];
  } else if(difficultySelectElement.value === "hard"){
    operators = [...difficultyHard];
  }
};

//initializes the game, countdown and animation
function startGame() {
  showGamePage = true;
  showInstructionsPage = false;
  showLandingPage = false;
  displaySummaryPage = false;
  paused = false;
  loadSite();
  mathChallenges();
  countDown()
  drawAll();
}

//genrates random math question based on diffculty selected
function mathChallenges () {
  const a = Math.floor(Math.random()*10);
  const b = Math.floor(Math.random()*10);
  let operator = operators[Math.floor(Math.random()*operators.length)];
  
  if(!operator){operator = '+'};
  if(operator === '+'){
    question = `Question ${a}+${b} = ?`
    correctAnswer = a + b;
  } else if (operator === '-'){
    question = `Question ${a}-${b} = ?`
    correctAnswer = a - b;
  } else if (operator === '*'){
    question = `Question ${a}x${b} = ?`
    correctAnswer = a * b;
  } 

  const wrongAnswers = new Set(); //Set() ensures that all values are unique!. create a set using the Set constructor:
  //I want to keep update the set, until I have 3 unique wrong answers. use array.size with set()

  while (wrongAnswers.size<3){ 
  let wrong;
  if (operator === '+'){
      wrong = Math.floor(Math.random()*19) //max possible 9+9 is 18. *19 ensures that the wrong number is between 0 to 18
    } else if(operator === '-'){
      wrong = Math.floor(Math.random()*19)-9 //extremes are -9 and +9
    } else if(operator === '*'){
      wrong = Math.floor(Math.random()*80) //max possible 9*9 = 81
    } 
    if(wrong !== correctAnswer && wrong >= 0) { 
      wrongAnswers.add(Math.floor(wrong)); //ensures answers are integers
    }
  }

  //I want to copy both correct and wrong answers into a single array
  //.sort() => math.random() - 0.5) randomly shuffles the answers in the array
  // math.Random() gives a value between 0 - 1, The compare fucntion of array.sort(return a-b) gives a -ve or +ve number. if -ve the the compare fucntion swaps the two elements; if +ve the compare function does not swap. 
  const answerOptions = [...wrongAnswers,correctAnswer].sort(() => Math.random() - 0.5);

  return { 
      question,
      correctAnswer,
      options: answerOptions,
    };
    
};

  let challenge = mathChallenges(); //save question, answer and wrongoptions to a variable that contains an object {question:xxx, correctAnswer: c, options: [x,y,z,c]}
  console.log(challenge.correctAnswer);
 
  questionParagraphElement.textContent = challenge.question;  //display question below game canvas


    //I want to compare the correct answer against the collided ball
    //I want to display a congratulations message when the correct answer is selected
    //I want to update the score for every correct answer
    //I want to update the current streak for every current answer

  function compareAnswers(){
    if (!challenge) return; // Prevents error if challenge is null
    if(isCollision){
      if (playerAnswer === challenge.correctAnswer){
        correctAnswers.push(challenge.question);
        currentStreak +=1;
        score+=10
        fiveStreak();

        scoreElement.textContent = score;
        currentStreakElement.textContent = currentStreak;
        questionParagraphElement.textContent = 'Good Job!';

        setTimeout(()=>{
          resetGame();
          drawAll(); //restart animation
          nextLevel();
        },1000);

      } else if (playerAnswer !== challenge.correctAnswer){
          wrongAnswers.push(challenge.question);
          questionParagraphElement.textContent = 'Try Again!'
          lives = Math.max(0, lives-1);
          livesElement.textContent = lives
          //currentStreak = Math.max(0,currentStreak-1); 
          currentStreak = 0;
          currentStreakElement.textContent = currentStreak;

          setTimeout(()=>{
            resetGame();
            drawAll(); //restart animation
          },1000);
      }}
    };

    //Increases game difficulty (speed, level) 
    function nextLevel(){
      if(score>=50 && currentLevel === 1){
          currentLevel = 2;
          renderLevel();
          circles.speed = 3;
          markerSettings.Speed = 3;
          timeLeft = 60;
          timerElement.textContent = timeLeft;
          paused = false;
        //1 sec delay before showing the next question
        setTimeout(() => {
          questionParagraphElement.textContent = challenge.question;
        },1000);
      } else if(score>=100 && currentLevel === 2){
          currentLevel = 3;
          renderLevel();
          circles.speed=4;
          markerSettings.Speed = 4;
          timeLeft = 60;
          timerElement.textContent = timeLeft;
          paused = false;

        setTimeout(()=>{
          questionParagraphElement.textContent = challenge.question;
        },1000);
      }
    }
   
    //Resets the falling circles and generates a new math challenge.
    function resetGame() {
      cancelAnimationFrame(startAnimation); //pause animation
      challenge = mathChallenges(); //generates a new challenge
      questionParagraphElement.textContent = challenge.question;
      
      //reinitilize circles drop down
      circles.circlesArray = []; 
      for (let i=0; i<circles.xAxis.length; i++){
        circles.circlesArray.push({
        x:circles.xAxis[i],
        y: Math.random()*-canvas.height, 
        value: challenge.options[i], 
      })};
    }

    //countdown and end game when time runs out
    function countDown(){
      if(paused){
        return;
      }
      if(timeLeft>0){
        timeLeft -=1;
        timerElement.textContent = timeLeft
        countdownTimerId = setTimeout(countDown,1000);
        console.log('Timeleft:' + timeLeft);
      } else {
        endGame();
      }
    }
    
    //end of the game when time or lives run out.
    function endGame(){
      if (!gameOver && lives === 0){
          gameOver = true;
          console.log("Game Over");
          cancelAnimationFrame(startAnimation); //pause animation
          questionParagraphElement.textContent = "Game Over!";
          paused = true;
          showSummaryPage();
          return;
        } 
      if(!gameOver && timeLeft === 0){
          gameOver = true;
          console.log("Time's Up!");
          cancelAnimationFrame(startAnimation); //pause animation
          questionParagraphElement.textContent = "Time's Up!";
          showSummaryPage();
          return;
      }
    }

    // player gets an extra life after 5 correct answers in a row.
    function fiveStreak(){
      if(currentStreak === 5){
          lives += 1;
          livesElement.textContent = lives;
          currentStreak = 0;
          questionParagraphElement.textContent = "Life Added!";
      } 
    }

    //Resets game to initial state.
    function resetGameState(){
        score = 0;
        lives = 3;
        timeLeft = 60;
        currentStreak = 0;
        paused = false;
        isCollision = false;
        gameOver = false;
        currentLevel = 1;
        circles.speed = 2;
        markerSettings.Speed = 2;
        operators = [];
        challenge = null;
        correctAnswers = [];
        wrongAnswers = [];
        scoreElement.textContent = score;
        currentStreakElement.textContent = currentStreak;
        livesElement.textContent = lives;
        timerElement.textContent = timeLeft;
        cancelAnimationFrame(startAnimation);
        clearTimeout(countdownTimerId); 
        loadSite();
      }

    //Pause or Resumes the Game
    handlePauseBtn = () => {
      if(!paused){
          cancelAnimationFrame(startAnimation); //pause animation
          paused = true;
          pauseBtnElement.textContent = "Resume";
        } else {
          paused = false;
          pauseBtnElement.textContent = "Pause";
          drawAll();
          countDown();
        } 
      };

      //reset the game 
    handleResetBtn = () => {
      resetGameState();
      renderLevel();
      resetGame();
      drawAll();
      countDown();
    }

    //Quits the game and return to the landing page
    handleQuitBtn = () => {
      showInstructionsPage = false;
      showLandingPage = true;
      showGamePage = false;
      displaySummaryPage = false;
      paused = true;
      clearTimeout(countdownTimerId); // Stop timer
      resetGameState();
      renderLevel();
      loadSite();
    }

    //Shows the summary page
    function showSummaryPage(){
      gamePage.style.display = 'none';
      summaryPage.style.display = 'block';  
      totalPoints.textContent = score;

      correctAnswers.forEach(answer => {
        const li = document.createElement('li');
        li.textContent = answer;
        correctAnswersList.appendChild(li);
      });
  
      wrongAnswers.forEach(answer => {
        const li = document.createElement('li');
        li.textContent = answer;
        wrongAnswersList.appendChild(li);
      });
      }
  
      //shows the current level
      function renderLevel() {
          const levelContainer = document.getElementById('level-container');
          levelContainer.innerHTML = '';
          for (let i = 0; i < currentLevel; i++) {
          const star = document.createElement('span');
          star.textContent = '⭐';
          levelContainer.appendChild(star);
          }
        }
        


/*----------------------------- Event Listeners -----------------------------*/

startInstructionsBtnElement.addEventListener('click',handlePlayerInput);
startGameBtnElement.addEventListener('click', startGame);
pauseBtnElement.addEventListener("click", handlePauseBtn);
resetBtnElement.addEventListener("click",handleResetBtn);
quitBtnElement.addEventListener("click",handleQuitBtn);
homePageBtnElement.addEventListener("click",handleQuitBtn);

document.addEventListener("keydown", (event) => {
  const keysToPrevent = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  if (keysToPrevent.includes(event.key)) {
      event.preventDefault(); // stops page scrolling when up/down arriw keys are pressed. 
    }});

restartButtonElement.addEventListener('click',() => {
    showInstructionsPage = false;
    showLandingPage = false;
    showGamePage = true;
    displaySummaryPage = false;
    resetGameState();
    renderLevel();
    resetGame();
    startAnimation = requestAnimationFrame(drawAll); 
    countDown();
    endGame();
  }
);

/*---------------------------------- Canvas ----------------------------------*/
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext('2d');

//road markers
const markerSettings = {
  width : 50,
  height : 200,
  Speed : 2,
  xPositions : [200,600],
  markers : [],
}

for(let x of markerSettings.xPositions){
  for (let i=0;i<5; i++){
    markerSettings.markers.push({
      x: x,
      y: i*300, //space apart by 300px
    });
  }
}



//Draw the car
const car = {
  x: canvas.width/2,
  y: canvas.height - 200,
  width: 80,
  height: 150,
  speed : 30,
}

const carImage = new Image();
carImage.src = './Math_Racer/Resources/Car.png';

document.addEventListener("keydown",(event) => {
  if(event.key === "ArrowLeft"){
      if(car.x > 0){
        car.x -= car.speed //as along as within canvas, can move to left
      };
    } if (event.key==="ArrowRight"){
      if(car.x+80<canvas.width){ //+80 to account for width of car
        car.x += car.speed //as long as within canvas, can move to the right
      }
    } if (event.key==="ArrowUp"){
      if(car.y>0){ 
        car.y -= car.speed 
      }
    }  if (event.key==="ArrowDown"){
        if(car.y+150<canvas.height){ //+200 to account for width of car
          car.y += car.speed 
        }
    }});

  
//circles 

const circles = {
  xAxis:[150,300,450,600],
  radius:50,
  speed: 2,
  circlesArray : [], //We need to save in format [{x:0, y:0, value:0};{x:0, y:0, value:0};{x:0, y:0, value:0}; ] 
}

//for each X axis value, i want to generate one circle at randomised y axis positions. The circles contain the answer options both correct and incorrect 
for (let i=0; i<circles.xAxis.length; i++){
    circles.circlesArray.push({
      x:circles.xAxis[i],
      y: Math.random()*-canvas.height, //circles start above the visible screen, instead of abruptly appearing mid-way or at the bottom.
      value: challenge.options[i], //assign one value per circle from shuffled options array: [x,y,z,c], so circlesArray contains [{x:0, y:0, value:0};{x:0, y:0, value:0};{x:0, y:0, value:0}; ] 
  })
}

//detect collision between circle with x,y,radius & car with x,y,width & height
function detectCollision(circle,car){
//find closest point between rectangle perimeter to center of circle
const closestX = Math.max(car.x, Math.min(circle.x, car.x+car.width));
const closestY = Math.max(car.y, Math.min(circle.y, car.y+car.height));

const dx = circle.x - closestX;
const dy = circle.y - closestY;


let distanceSquared = (dx*dx) + (dy*dy); //pythagorean theorem a2 + b2 = c2. We use sqaured to get better perfromance as Math.sqrt() is computationally expensive. So instead, we avoid taking the square root by squaring both sides of the comparison:
return distanceSquared < (circles.radius * circles.radius)

}


//master draw

function drawAll(){
  ctx.clearRect(0,0,canvas.width, canvas.height)

  //draw road Markers
  ctx.fillStyle = "white";
  for (let marker of markerSettings.markers) {
      ctx.fillRect(marker.x, marker.y, markerSettings.width, markerSettings.height);
      marker.y += markerSettings.Speed;
  
  if (marker.y > canvas.height) {
        marker.y = -300; //i want to start from top of screen, one the last marker goes out of the canvas. I set y=0 
      }
    }
  

  //draw Car
  
    ctx.fillStyle = "red";
    ctx.fillRect(carImage, car.y, car.width, car.height);
    ctx.drawImage(carImage, car.x, car.y, car.width, car.height);

  //draw falling Circles
  for(let circle of circles.circlesArray){
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circles.radius ,0, Math.PI*2);
      ctx.fillStyle = '#da2323';
      ctx.fill();

      //number inside each circle
      ctx.fillStyle = 'white';
      ctx.font = '35px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(circle.value, circle.x, circle.y);

      circle.y += circles.speed
    
      if(circle.y - circles.radius>canvas.height){
          circle.y = 0 ;}

      //Check collision between circle and car
      if(detectCollision(circle,car)){
        isCollision = true;
        circle.y = -Math.random() * canvas.height; //reset circle.y upon collision 
        console.log(`Value is: ${circle.value}`);
        playerAnswer = circle.value;
        compareAnswers();
        isCollision = false;     
        console.log('PlayerAnswer is' + playerAnswer)
      }
    }
    if (gameOver) {return};
    startAnimation = requestAnimationFrame(drawAll);
    endGame()
  }
