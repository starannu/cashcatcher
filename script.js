const trump = document.getElementById("trump");
const container = document.querySelector(".game-area");
const moneyContainer = document.getElementById("money-container");
const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer"); // Optional if still shown

let score = 0;
let moveDirection = 0;
let velocity = 5;
let gameEnded = false;

let totalMoneyDropped = 0;
const totalToDrop = 23;

scoreDisplay.textContent = "Score: 0";
if (timerDisplay) timerDisplay.textContent = ""; // You can remove or repurpose

// Game Loop for Movement
function gameLoop() {
  const trumpPos = trump.offsetLeft;
  const containerRect = container.getBoundingClientRect();
  const trumpRect = trump.getBoundingClientRect();

  const leftLimit = 0;
  const rightLimit = container.offsetWidth - trump.offsetWidth;

  if (moveDirection === -1 && trump.offsetLeft > leftLimit) {
    trump.style.left = trumpPos - velocity + "px";
  }
  if (moveDirection === 1 && trump.offsetLeft < rightLimit) {
    trump.style.left = trumpPos + velocity + "px";
  }

  requestAnimationFrame(gameLoop);
}

// Spawn One Falling Money
function spawnMoney() {
  if (gameEnded || totalMoneyDropped >= totalToDrop) return;

  totalMoneyDropped++;

  const money = document.createElement("div");
  money.classList.add("money");

  const x = Math.random() * (container.offsetWidth - 30);
  money.style.left = `${x}px`;

  container.appendChild(money);

  let y = 0;
  const fallInterval = setInterval(() => {
    y += 3;
    money.style.top = `${y}px`;

    const moneyRect = money.getBoundingClientRect();
    const trumpRect = trump.getBoundingClientRect();

    if (
      moneyRect.bottom >= trumpRect.top &&
      moneyRect.right >= trumpRect.left &&
      moneyRect.left <= trumpRect.right &&
      moneyRect.top <= trumpRect.bottom
    ) {
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      money.remove();
      clearInterval(fallInterval);

      if (score === totalToDrop) {
        gameEnded = true;
        window.location.href = "win.html";
      }
    }

    if (y > container.offsetHeight) {
      money.remove();
      clearInterval(fallInterval);

      if (totalMoneyDropped === totalToDrop && score < totalToDrop) {
        gameEnded = true;
        window.location.href = "lose.html";
      }
    }
  }, 20);
}

// Start Spawning Money (max 23)
const dropInterval = setInterval(() => {
  if (totalMoneyDropped >= totalToDrop || gameEnded) {
    clearInterval(dropInterval);
  } else {
    spawnMoney();
  }
}, 1000); 

// Adjust spawn speed here (in ms)
const timerInterval = setInterval(() => {
  if (gameEnded) {
    clearInterval(timerInterval);
    return;
  }

  timeLeft--;
  if (timerDisplay) {
    timerDisplay.textContent = `Time: ${timeLeft}s`;
  }

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    gameEnded = true;

    if (score === totalToDrop) {
      window.location.href = "win.html";
    } else {
      window.location.href = "lose.html";
    }
  }
}, 1000);

// Arrow Button Movement
leftArrow.addEventListener("mousedown", () => (moveDirection = -1));
rightArrow.addEventListener("mousedown", () => (moveDirection = 1));
leftArrow.addEventListener("mouseup", () => (moveDirection = 0));
rightArrow.addEventListener("mouseup", () => (moveDirection = 0));

// Touch support
leftArrow.addEventListener("touchstart", () => (moveDirection = -1));
rightArrow.addEventListener("touchstart", () => (moveDirection = 1));
leftArrow.addEventListener("touchend", () => (moveDirection = 0));
rightArrow.addEventListener("touchend", () => (moveDirection = 0));

// Optional: Mouse movement within container
document.addEventListener("mousemove", (e) => {
  const containerRect = container.getBoundingClientRect();
  const mouseX = e.clientX - containerRect.left;

  let newLeft = mouseX - trump.offsetWidth / 2;
  newLeft = Math.max(0, Math.min(newLeft, container.offsetWidth - trump.offsetWidth));
  trump.style.left = `${newLeft}px`;
});

// Initialize movement loop
gameLoop();