const resetButton = document.getElementById("buttons__reset");
const startButton = document.getElementById("buttons__start");
const ballCountInput = document.getElementById("ballCount");

const ballRadius = 10;
const minDistance = 80;
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let balls = [];
let animationFrame = null;

let frameCount = 0;

const angleToRadians = (angle) => {
  return (Math.PI / 180) * angle;
};

const resetCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  balls.length = 0;
  cancelAnimationFrame(animationFrame);
};

const drawBall = (x, y) => {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, angleToRadians(360));
  ctx.strokeStyle = "green";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
};

const drawLineBetweenBalls = (firstBall, secondBall) => {
  ctx.beginPath();
  ctx.moveTo(firstBall.x, firstBall.y);
  ctx.lineTo(secondBall.x, secondBall.y);
  ctx.strokeStyle = "blue";
  ctx.stroke();
  ctx.closePath();
};

const generateBalls = () => {
  const ballCount = ballCountInput.value;

  if (!ballCount) {
    alert("Brak kulek!");
  }

  balls = [];

  for (let i = 0; i < ballCount; i++) {
    balls.push({
      x: Math.random() * (canvas.width - 2 * ballRadius) + ballRadius,
      y: Math.random() * (canvas.height - 2 * ballRadius) + ballRadius,
      dx: Math.random() - 0.5 * 4,
      dy: Math.random() - 0.5 * 4,
    });
  }

  drawCanvas();
};

const drawCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < balls.length; i++) {
    const currentBall = balls[i];

    currentBall.x += currentBall.dx;
    currentBall.y += currentBall.dy;

    if (
      currentBall.x - ballRadius < 0 ||
      currentBall.x + ballRadius > canvas.width
    )
      currentBall.dx = -currentBall.dx;
    if (
      currentBall.y - ballRadius < 0 ||
      currentBall.y + ballRadius > canvas.height
    )
      currentBall.dy = -currentBall.dy;
    drawBall(currentBall.x, currentBall.y);

    for (let j = i + 1; j < balls.length; j++) {
      const siblingBall = balls[j];

      const distance = Math.sqrt(
        (currentBall.x - siblingBall.x) ** 2 +
          (currentBall.y - siblingBall.y) ** 2
      );

      if (distance < minDistance) {
        drawLineBetweenBalls(currentBall, siblingBall);
      }
    }
  }

  frameCount++;
  animationFrame = requestAnimationFrame(drawCanvas);
};

setInterval(() => {
  console.log(`fps: ${frameCount}`);
  frameCount = 0;
}, 500);

resetButton.onclick = resetCanvas;
startButton.onclick = generateBalls;
