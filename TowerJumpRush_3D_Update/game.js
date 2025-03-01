const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 50; // space for ad banner

let player = {
    x: canvas.width / 2,
    y: 150,
    radius: 20,
    color: 'deepskyblue',
    velocityY: 2,
    rotationSpeed: 5,
    gradient: null
};

let platforms = [];
let score = 0;
let isGameOver = false;

function createPlatform(y) {
    const gapSize = 150 + Math.random() * 50;  // easier gaps
    const gapPosition = Math.random() * (canvas.width - gapSize);
    platforms.push({ y, gapPosition, gapSize });
}

function initPlatforms() {
    for (let i = 0; i < 8; i++) {
        createPlatform(canvas.height - i * 120);
    }
}

function initPlayerGradient() {
    player.gradient = ctx.createRadialGradient(player.x, player.y, 5, player.x, player.y, player.radius);
    player.gradient.addColorStop(0, "white");
    player.gradient.addColorStop(1, player.color);
}

initPlatforms();
initPlayerGradient();

function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.gradient;
    ctx.fill();
    ctx.closePath();
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 5;
}

function drawPlatforms() {
    platforms.forEach(platform => {
        ctx.fillStyle = 'linear-gradient(90deg, #ff6f61, #ffcc33)';
        ctx.fillRect(0, platform.y, platform.gapPosition, 25);  // Left side
        ctx.fillRect(platform.gapPosition + platform.gapSize, platform.y, canvas.width - platform.gapPosition - platform.gapSize, 25);  // Right side
    });
}

function updatePlatforms() {
    platforms.forEach(platform => {
        platform.y -= player.velocityY;
    });
    if (platforms[0].y < -25) {
        platforms.shift();
        createPlatform(canvas.height);
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
    }
}

function detectCollision() {
    for (const platform of platforms) {
        if (player.y + player.radius > platform.y && player.y - player.radius < platform.y + 25) {
            if (player.x < platform.gapPosition || player.x > platform.gapPosition + platform.gapSize) {
                isGameOver = true;
            }
        }
    }
}

function gameOver() {
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2 - 20);
    ctx.font = '24px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 100, canvas.height / 2 + 30);
    ctx.fillText('Press Space to Restart', canvas.width / 2 - 150, canvas.height / 2 + 70);
}

function updatePlayer() {
    player.y += player.velocityY;

    if (player.y > canvas.height) {
        isGameOver = true;
    }

    if (player.x < player.radius) player.x = player.radius;
    if (player.x > canvas.width - player.radius) player.x = canvas.width - player.radius;

    initPlayerGradient();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isGameOver) {
        gameOver();
        return;
    }

    drawPlatforms();
    drawPlayer();
    updatePlatforms();
    updatePlayer();
    detectCollision();

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (isGameOver && e.key === ' ') {
        resetGame();
    } else if (e.key === 'ArrowLeft') {
        player.x -= player.rotationSpeed;
    } else if (e.key === 'ArrowRight') {
        player.x += player.rotationSpeed;
    }
});

function resetGame() {
    player.y = 150;
    platforms = [];
    score = 0;
    isGameOver = false;
    initPlatforms();
    gameLoop();
    scoreDisplay.textContent = "Score: 0";
}

gameLoop();
