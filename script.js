const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

function drawInitialMessage() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Please press any button to start the game!", canvas.width / 2, canvas.height / 2.2);
    ctx.fillText("Made by Amaan Ali", canvas.width / 2, canvas.height / 1.7);
}
drawInitialMessage();

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 2,
    dx: 2,
    dy: 2
};

const paddleWidth = 10, paddleHeight = 60;
const user = { x: 0, y: canvas.height / 2 - paddleHeight / 2, dy: 4, score: 0 };
const ai = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, dy: 4, score: 0 };

let aiLevel = 0;
let gameStarted = false;

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "24px SleekFont";
    ctx.fillText(text, x, y);
}


function handleKeyPress(evt) {
    if (!gameStarted) {
        gameStarted = true;
        ball.dx = -2;
        ball.dy = 2 * (Math.random() * 2 - 1);
    }
    
    switch (evt.keyCode) {
        case 38:  // Up arrow
            evt.preventDefault();
            user.dy = -4;  
            break;
        case 40:  // Down arrow
            evt.preventDefault();
            user.dy = 4;  
            break;
    }
}

function handleKeyRelease(evt) {
    switch (evt.keyCode) {
        case 38:
        case 40:
            user.dy *= 0.9; // Slow down the paddle movement when keys are released
            break;
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    let randomDirectionX = Math.random() > 0.5 ? 1 : -1;
    let randomDirectionY = Math.random() > 0.5 ? 1 : -1;
    
    ball.speed *= 1.01;
    ball.dx = randomDirectionX * ball.speed;
    ball.dy = randomDirectionY * ball.speed;
}


function update() {
    user.y += user.dy;
    
    if (user.y < 0) user.y = 0;
    if (user.y + paddleHeight > canvas.height) user.y = canvas.height - paddleHeight;

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) ball.dy *= -1;

    let paddle = (ball.dx > 0) ? ai : user;
    if (
        ball.x + ball.radius > paddle.x && 
        ball.x - ball.radius < paddle.x + paddleWidth &&
        ball.y + ball.radius > paddle.y &&
        ball.y - ball.radius < paddle.y + paddleHeight
    ) {
        ball.dx *= -1;
    }

    if (ball.x - ball.radius < 0) {
        ai.score += 1;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score += 1;
        if (user.score % 5 === 0) {
            aiLevel++;
            canvas.style.backgroundColor = `hsl(${Math.random() * 360}, 50%, 50%)`;
        }
        resetBall();
    }

    let aiSpeed = 0.05 * (1 + aiLevel);
    let reactionThreshold = 0.3;

    if (Math.random() > reactionThreshold) {
        ai.y += (ball.y - (ai.y + paddleHeight / 2)) * aiSpeed;
    }

    if (ai.y < 0) ai.y = 0;
    if (ai.y + paddleHeight > canvas.height) ai.y = canvas.height - paddleHeight;

    user.dy *= 0.9;
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(user.x, user.y, paddleWidth, paddleHeight, "white");
    drawRect(ai.x, ai.y, paddleWidth, paddleHeight, "white");
    drawCircle(ball.x, ball.y, ball.radius, "white");
    drawText(user.score, canvas.width / 4, 30, "white");
    drawText(ai.score, 3 * canvas.width / 4, 30, "white");
}

function gameLoop() {
    if (gameStarted) {
        update();
        draw();
    }
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", handleKeyPress);
document.addEventListener("keyup", handleKeyRelease);

gameLoop();
