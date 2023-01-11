// Get reference to canvas element
var canvas = document.getElementById("gameCanvas");
// Get canvas context
var ctx = canvas.getContext("2d");

// Score object
var score = {
  player: 0,
  ai: 0
};

// Draw score on canvas
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Player: " + score.player, 8, 20);
  ctx.fillText("AI: " + score.ai, canvas.width - 65, 20);
}

//结束时显示游戏结果的代码。这个例子假设你已经定义了一个变量 score 来存储游戏的分数，并且已经编写了一个函数 drawScore 来在 canvas 上绘制分数。

// Winning score
const WINNING_SCORE = 10;

// Check if game is over
function checkGameOver() {
  if (score.player >= WINNING_SCORE || score.ai >= WINNING_SCORE) {
    // Stop game loop
    cancelAnimationFrame(gameLoop);

    // Display game over message
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    if (score.player >= WINNING_SCORE) {
      ctx.fillText("You won!", canvas.width / 2, canvas.height / 2);
    } else {
      ctx.fillText("AI won!", canvas.width / 2, canvas.height / 2);
    }
  }
}
// Game timer
var gameTimer = 15;

// Game loop function
// Game loop function
function gameLoop() {
  // Decrement game timer
  gameTimer--;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update ball position
  updateBall();

  // Update paddles position
  updatePaddle();
  updateAIPaddle();

  // Draw ball, paddles, and score
  drawBall();
  drawPaddle();
  drawAIPaddle();
  drawScore();

  // Check if game is over
  checkGameOver();

  // Check if game timer has reached 0
  if (gameTimer <= 0) {
    // Stop game loop
    cancelAnimationFrame(gameLoop);

    // Display game over message
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Time's up!", canvas.width / 2, canvas.height / 2);
  }

  // Update score element with current score
  scoreElement.innerHTML = "Player: " + score.player + " AI: " + score.ai;

  // Update timer element with current time
  timerElement.innerHTML = gameTimer;

  // Continue game loop
  gameLoopId = requestAnimationFrame(gameLoop);
}

// Ball object
var ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 5,
  dx: Math.random() > 0.5 ? 5 : -5, // Randomly set dx to 5 or -5
dy: Math.random() > 0.5 ? 5 : -5 // Randomly set dy to 5 or -5
};

// Paddle object
var paddle = {
  x: canvas.width / 2,
  y: canvas.height - 20,
  width: 75,
  height: 10,
  speed: 5,
  dx: 0
};

// AI Paddle object
var aiPaddle = {
  x: canvas.width / 2,
  y: 10,
  width: 75,
  height: 10,
  speed: 5,
  dx: 0
};

// Draw ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Draw paddles on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Draw AI paddle on canvas
function drawAIPaddle() {
  ctx.beginPath();
  ctx.rect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Move paddles on canvas
function movePaddle() {
  paddle.x += paddle.dx;

  // Wall detection
  if (paddle.x + paddle.width > canvas.width) {
    paddle.x = canvas.width - paddle.width;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

// Move ball on canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision (right/left)
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
  }

  // Wall collision (top/bottom)
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }

  // Paddle collision
  if (
    ball.x - ball.radius < paddle.x + paddle.width &&
    ball.x + ball.radius > paddle.x &&
    ball.y + ball.radius > paddle.y
  ) {
    ball.dy = -ball.dy;
  }

  // AI Paddle collision
  if (
    ball.x - ball.radius < aiPaddle.x + aiPaddle.width &&
    ball.x + ball.radius > aiPaddle.x &&
    ball.y - ball.radius < aiPaddle.y + aiPaddle.height
  ) {
    ball.dy = -ball.dy;
  }

  // Ball goes off screen (bottom)
  if (ball.y + ball.radius > canvas.height) {
    resetBall();
  }

  // Ball goes off screen (top)
  if (ball.y - ball.radius < 0) {
    resetBall();
  }
}

// Reset ball position and velocity
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = -ball.dx;
  ball.dy = -ball.dy;
}

// Update AI paddle position
function updateAIPaddle() {
  // Calculate AI paddle center
  var aiPaddleCenter = aiPaddle.x + aiPaddle.width / 2;
  // Calculate ball center
  var ballCenter = ball.x + ball.radius / 2;
  // Calculate distance between ball center and AI paddle center
  var distance = ballCenter - aiPaddleCenter;
  // Move AI paddle towards ball
  aiPaddle.x += distance * 0.1;

  // Wall detection
  if (aiPaddle.x + aiPaddle.width > canvas.width) {
    aiPaddle.x = canvas.width - aiPaddle.width;
  }

  if (aiPaddle.x < 0) {
    aiPaddle.x = 0;
  }
}

// Render function
function render() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw ball
  drawBall();
  // Draw paddles
  drawPaddle();
  drawAIPaddle();
}

// Game loop
function gameLoop() {
  updateAIPaddle();
  movePaddle();
  moveBall();
  render();
  requestAnimationFrame(gameLoop);
}

// Keyboard event handlers
function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}

function keyUpHandler(e) {
  if (
    e.key == "Right" ||
    e.key == "ArrowRight" ||
    e.key == "Left" ||
    e.key == "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

// Add event listeners
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// Start game loop
gameLoop();
