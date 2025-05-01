
const trump = document.getElementById("trump");
const moneyContainer = document.getElementById("money-container");
const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
let timeLeft = 30;
let gameEnded = false;

let score = 0;
let velocity = 5;
let moveDirection = 0;

// Move Trump
function gameLoop() {
  let trumpPos = trump.offsetLeft;

  if (moveDirection === -1 && trumpPos > 0) {
    trump.style.left = trumpPos - velocity + "px";
  }
  if (moveDirection === 1 && trumpPos < window.innerWidth - trump.offsetWidth) {
    trump.style.left = trumpPos + velocity + "px";
  }

  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

// Start the timer
const timerInterval = setInterval(() => {
  timeLeft--;
  timerDisplay.textContent = "Time: " + timeLeft + "s";

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    gameEnded = true;
    // Example: decide win or lose based on score
  if (score >= 10) {
    window.location.href = "win.html";
  } else {
    window.location.href = "lose.html";
  }
  }
}, 1000);

// Start spawning money every 1.5s
setInterval(spawnMoney, 1500);


// Spawn Money
function spawnMoney() {
if (gameEnded) return;

  const money = document.createElement("div");
  money.classList.add("money");

  const x = Math.random() * (window.innerWidth - 30);
  money.style.left = x + "px";

  moneyContainer.appendChild(money);

  let y = 0;
  const fallInterval = setInterval(() => {
    y += 3;
    money.style.top = y + "px";

    const moneyRect = money.getBoundingClientRect();
    const trumpRect = trump.getBoundingClientRect();

    if (
      moneyRect.bottom >= trumpRect.top &&
      moneyRect.right >= trumpRect.left &&
      moneyRect.left <= trumpRect.right &&
      moneyRect.top <= trumpRect.bottom
    ) {
      score++;
      scoreDisplay.textContent = "Score: " + score;
      money.remove();
      clearInterval(fallInterval);
    }

    if (y > window.innerHeight) {
      money.remove();
      clearInterval(fallInterval);
    }
  }, 20);
}

// Mouse Movement
document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const trumpWidth = trump.offsetWidth;
    let newLeft = mouseX - trumpWidth / 2;
  
    // Clamp within screen bounds
    newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - trumpWidth));
    trump.style.left = newLeft + "px";
  }); 


// Arrow Button Events
leftArrow.addEventListener("mousedown", () => (moveDirection = -1));
rightArrow.addEventListener("mousedown", () => (moveDirection = 1));

leftArrow.addEventListener("mouseup", () => (moveDirection = 0));
rightArrow.addEventListener("mouseup", () => (moveDirection = 0));

// For touch devices
leftArrow.addEventListener("touchstart", () => (moveDirection = -1));
rightArrow.addEventListener("touchstart", () => (moveDirection = 1));
leftArrow.addEventListener("touchend", () => (moveDirection = 0));
rightArrow.addEventListener("touchend", () => (moveDirection = 0));

// Start
gameLoop();
setInterval(spawnMoney, 1500);

