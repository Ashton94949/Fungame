const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 50; // Leave room for ad banner

let player = {
    x: canvas.width / 2,
    y: 100,
    radius: 15,
    color: 'deepskyblue',
    velocityY: 2,
    rotationSpeed: 4
};

let platforms = [];
let score = 0;
let isGameOver = false;

function createPlatform(y) {
    const gapSize = 100 + Math.random() * 50;
    const gapPosition = Math.random() * (canvas.width - gapSize);
    platforms.push({ y, gapPosition, gapSize });
}

function initPlatforms() {
    for (let i = 0; i < 10; i++) {
        createPlatform(canvas.height - i * 100);
    }
}

initPlatforms();

function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
}

function drawPlatforms() {
    platforms.forEach(platform => {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, platform.y, platform.gapPosition, 20);
        ctx.fillRect(platform.gapPosition + platform.gapSize, platform.y, canvas.width - platform.gapPosition - platform.gapSize, 20);
    });
}

function updatePlatforms() {
    platforms.forEach(platform => {
        platform.y -= player.velocityY;
    });
    if (platforms[0].y < -20) {
        platforms.shift();
        createPlatform(canvas.height);
        score++;
    }
}

function detectCollision() {
    for (const platform of platforms) {
        if (player.y + player.radius > platform.y && player.y - player.radius < platform.y + 20) {
            if (player.x < platform.gapPosition || player.x > platform.gapPosition + platform.gapSize) {
                isGameOver = true;
            }
        }
    }
}

function gameOver() {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
    ctx.fillText(`Score: ${score}`, canvas.width / 2 - 100, canvas.height / 2 + 50);
    ctx.fillText('Press Space to Restart', canvas.width / 2 - 150, canvas.height / 2 + 100);
}

function updatePlayer() {
    player.y += player.velocityY;

    if (player.y > canvas.height) {
        isGameOver = true;
    }

    if (player.x < player.radius) player.x = player.radius;
    if (player.x > canvas.width - player.radius) player.x = canvas.width - player.radius;
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
    player.y = 100;
    platforms = [];
    score = 0;
    isGameOver = false;
    initPlatforms();
    gameLoop();
}

gameLoop();
