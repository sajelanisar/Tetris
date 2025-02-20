const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");
canvas.width = 300;
canvas.height = 600;

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = canvas.width / COLS;

let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
let score = 0;
let activePiece;
let gameInterval;

const COLORS = ["#e94560", "#08d9d6", "#ffde59", "#ff2e63", "#6a0572", "#f8f32b"];

const PIECES = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 1, 0], [0, 1, 1]], // Z
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 1], [0, 0, 1]], // L
    [[1, 1, 1], [1, 0, 0]], // J
];

function getRandomPiece() {
    const shape = PIECES[Math.floor(Math.random() * PIECES.length)];
    return {
        shape,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        row: 0,
        col: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
    };
}

function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.forEach((row, r) => row.forEach((color, c) => color && drawBlock(c, r, color)));
}

function drawPiece(piece) {
    piece.shape.forEach((row, r) =>
        row.forEach((cell, c) => cell && drawBlock(piece.col + c, piece.row + r, piece.color))
    );
}

function movePiece(dir) {
    const newCol = activePiece.col + dir;
    if (!collision(activePiece.shape, activePiece.row, newCol)) {
        activePiece.col = newCol;
    }
}

function rotatePiece() {
    const rotated = activePiece.shape[0].map((_, i) => activePiece.shape.map(row => row[i])).reverse();
    if (!collision(rotated, activePiece.row, activePiece.col)) {
        activePiece.shape = rotated;
    }
}

function collision(shape, row, col) {
    return shape.some((r, i) => r.some((cell, j) => cell && (col + j < 0 || col + j >= COLS || row + i >= ROWS || grid[row + i]?.[col + j])));
}

function dropPiece() {
    if (!collision(activePiece.shape, activePiece.row + 1, activePiece.col)) {
        activePiece.row++;
    } else {
        activePiece.shape.forEach((row, r) =>
            row.forEach((cell, c) => cell && (grid[activePiece.row + r][activePiece.col + c] = activePiece.color))
        );
        clearRows();
        activePiece = getRandomPiece();
        if (collision(activePiece.shape, activePiece.row, activePiece.col)) {
            gameOver();
        }
    }
}

function clearRows() {
    grid = grid.filter(row => row.some(cell => !cell));
    while (grid.length < ROWS) grid.unshift(Array(COLS).fill(null));
    score += 10;
    document.getElementById("score").textContent = `Score: ${score}`;
}

function gameOver() {
    clearInterval(gameInterval);
    alert(`Game Over! Your score: ${score}`);
    resetGame();
}

function resetGame() {
    grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    score = 0;
    document.getElementById("score").textContent = `Score: ${score}`;
    activePiece = getRandomPiece();
    gameInterval = setInterval(() => {
        dropPiece();
        drawGrid();
        drawPiece(activePiece);
    }, 500);
}

document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") movePiece(-1);
    if (e.key === "ArrowRight") movePiece(1);
    if (e.key === "ArrowUp") rotatePiece();
    if (e.key === "ArrowDown") dropPiece();
});

document.getElementById("reset").addEventListener("click", resetGame);

activePiece = getRandomPiece();
resetGame();
