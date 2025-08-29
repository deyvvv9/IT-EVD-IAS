const gameContainer = document.querySelector('.game-container');
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const obstacle = document.getElementById('obstacle');
const gameOverText = document.getElementById('gameOver');
const score1Display = document.getElementById('score1');
const score2Display = document.getElementById('score2');

let player1Pos = { x: 50, y: 50 };
let score1 = 0;
let score2 = 0;
let isGameOver = false;

player1.style.top = `${player1Pos.y}px`;
player1.style.left = `${player1Pos.x}px`;
player2.style.top = `50px`;
player2.style.left = `50px`;

document.addEventListener('keydown', (e) => {
    if (isGameOver) return;

    const moveSpeed = 10;
    switch (e.key.toLowerCase()) {
        case 'w':
            if (player1Pos.y > 0) player1Pos.y -= moveSpeed;
            break;
        case 's':
            if (player1Pos.y < 470) player1Pos.y += moveSpeed;
            break;
        case 'a':
            if (player1Pos.x > 0) player1Pos.x -= moveSpeed;
            break;
        case 'd':
            if (player1Pos.x < 470) player1Pos.x += moveSpeed;
            break;
    }

    player1.style.top = `${player1Pos.y}px`;
    player1.style.left = `${player1Pos.x}px`;
});

// Player 2 follows mouse
document.addEventListener('mousemove', (e) => {
    if (isGameOver) return;
    const rect = gameContainer.getBoundingClientRect();
    const x = e.clientX - rect.left - 15;
    const y = e.clientY - rect.top - 15;
    if (x >= 0 && x <= 470) player2.style.left = `${x}px`;
    if (y >= 0 && y <= 470) player2.style.top = `${y}px`;
});

// Obstacle setup
let obstaclePos = { x: 0, y: 0 };
let direction = { x: 0, y: 1 }; // initial direction
let obstacleSpeed = 3;
let directionTimer = 0;

function randomDirection() {
    const sides = ['top', 'bottom', 'left', 'right'];
    const side = sides[Math.floor(Math.random() * sides.length)];

    switch (side) {
        case 'top':
            obstaclePos = { x: Math.random() * 480, y: 0 };
            direction = { x: 0, y: 1 };
            break;
        case 'bottom':
            obstaclePos = { x: Math.random() * 480, y: 500 };
            direction = { x: 0, y: -1 };
            break;
        case 'left':
            obstaclePos = { x: 0, y: Math.random() * 480 };
            direction = { x: 1, y: 0 };
            break;
        case 'right':
            obstaclePos = { x: 500, y: Math.random() * 480 };
            direction = { x: -1, y: 0 };
            break;
    }

    obstacle.style.left = `${obstaclePos.x}px`;
    obstacle.style.top = `${obstaclePos.y}px`;
}

randomDirection(); // initial position

function moveObstacle() {
    obstaclePos.x += direction.x * obstacleSpeed;
    obstaclePos.y += direction.y * obstacleSpeed;

    obstacle.style.left = `${obstaclePos.x}px`;
    obstacle.style.top = `${obstaclePos.y}px`;

    // When out of bounds, increase score & reset
    if (
        obstaclePos.x < -20 || obstaclePos.x > 520 ||
        obstaclePos.y < -20 || obstaclePos.y > 520
    ) {
        randomDirection();
        score1++;
        score2++;
        score1Display.textContent = score1;
        score2Display.textContent = score2;
    }
}

function checkCollision() {
    const p1 = player1.getBoundingClientRect();
    const p2 = player2.getBoundingClientRect();
    const obs = obstacle.getBoundingClientRect();

    if (
        (p1.left < obs.right && p1.right > obs.left && p1.top < obs.bottom && p1.bottom > obs.top) ||
        (p2.left < obs.right && p2.right > obs.left && p2.top < obs.bottom && p2.bottom > obs.top)
    ) {
        isGameOver = true;
        gameOverText.style.display = 'block';
        setTimeout(resetGame, 2000);
    }
}

function resetGame() {
    isGameOver = false;
    gameOverText.style.display = 'none';
    player1Pos = { x: 50, y: 50 };
    player1.style.left = '50px';
    player1.style.top = '50px';
    player2.style.left = '50px';
    player2.style.top = '50px';
    score1 = 0;
    score2 = 0;
    score1Display.textContent = score1;
    score2Display.textContent = score2;
    randomDirection();
}

function gameLoop() {
    if (!isGameOver) {
        moveObstacle();
        checkCollision();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
