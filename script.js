document.addEventListener('DOMContentLoaded', function () {
    // --- Ambil data dari URL ---
    const params = new URLSearchParams(window.location.search);
    const playerName = params.get('name') || 'Guest';
    const difficulty = params.get('difficulty') || 'easy';

    // Referensi elemen HTML
    const boardElement = document.getElementById('sudoku-board');
    const numberPaletteElement = document.getElementById('number-palette');
    const mistakesElement = document.getElementById('mistakes');
    const timerElement = document.getElementById('timer');
    const playerInfoElement = document.getElementById('player-info');

    // Tampilkan nama pemain dan kesulitan
    playerInfoElement.innerHTML = `Pemain: <strong>${playerName}</strong> (${difficulty})`;

    // Variabel state game
    let board = [];
    let solution = [];
    let selectedCell = null;
    let mistakes = 0;
    let timerInterval;
    let timeInSeconds = 0;

    const difficultySettings = { easy: 40, medium: 50, hard: 55 };

    // --- Inisialisasi Game ---
    function init() {
        setupNewGame();
    }

    function setupNewGame() {
        clearInterval(timerInterval);
        timeInSeconds = 0; mistakes = 0;
        updateTimerDisplay(); updateMistakesDisplay();

        generatePuzzle();
        createBoardUI();
        createNumberPaletteUI();

        for (let i = 1; i <= 9; i++) {
            checkNumberCompletion(i);
        }
        startTimer(); // Panggil fungsi timer
    }

    // --- Logika Pembuatan Sudoku ---
    function generatePuzzle() {
        board = Array(9).fill(0).map(() => Array(9).fill(0));
        solution = Array(9).fill(0).map(() => Array(9).fill(0));
        generateSolution(board);
        for (let i = 0; i < 9; i++) {
            solution[i] = [...board[i]];
        }
        pokeHoles(difficultySettings[difficulty]);
    }

    function generateSolution(grid) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        shuffle(numbers);
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    for (let num of numbers) {
                        if (isValid(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (generateSolution(grid)) return true;
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    function pokeHoles(holes) {
        let positions = Array.from({ length: 81 }, (_, i) => i);
        shuffle(positions);
        for (let i = 0; i < holes; i++) {
            const pos = positions[i];
            const row = Math.floor(pos / 9);
            const col = pos % 9;
            board[row][col] = 0;
        }
    }

    // --- Pembuatan UI ---
    function createBoardUI() {
        boardElement.innerHTML = '';
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = r; cell.dataset.col = c;
                if (board[r][c] !== 0) {
                    cell.textContent = board[r][c];
                    cell.classList.add('given');
                }
                if (r === 2 || r === 5) cell.style.borderBottom = "2px solid #333";
                if (c === 2 || c === 5) cell.style.borderRight = "2px solid #333";
                boardElement.appendChild(cell);
            }
        }
    }

    function createNumberPaletteUI() {
        numberPaletteElement.innerHTML = '';
        for (let i = 1; i <= 9; i++) {
            const numberDiv = document.createElement('div');
            numberDiv.classList.add('number');
            numberDiv.textContent = i;
            numberDiv.dataset.number = i;
            numberDiv.addEventListener('click', onNumberClick);
            numberPaletteElement.appendChild(numberDiv);
        }
    }

    // --- Penanganan Event ---
    boardElement.addEventListener('click', onCellClick);

    function onCellClick(e) {
        const cell = e.target;
        if (!cell.classList.contains('cell')) return;
        if (selectedCell) selectedCell.classList.remove('selected');
        selectedCell = cell;
        selectedCell.classList.add('selected');
        highlightPeers(cell);
    }

    function onNumberClick(e) {
        const selectedNumberDiv = e.target;
        if (!selectedCell || selectedCell.classList.contains('given')) return;

        const num = parseInt(selectedNumberDiv.textContent);
        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);

        if (solution[row][col] === num) {
            selectedCell.textContent = num;
            selectedCell.classList.add('user-input');
            board[row][col] = num;
            checkNumberCompletion(num);
            clearHighlights();
            selectedCell.classList.remove('selected');
            selectedCell = null;
            if (isGameWon()) handleWin();
        } else {
            mistakes++;
            updateMistakesDisplay();
            selectedCell.classList.add('error');
            setTimeout(() => selectedCell.classList.remove('error'), 500);
            if (mistakes >= 5) handleLoss();
        }
    }

    // --- Leaderboard & Win/Loss ---
    function handleWin() {
        clearInterval(timerInterval);
        saveToLeaderboard();
        alert(`Selamat, ${playerName}! Anda menyelesaikan puzzle dalam ${formatTime(timeInSeconds)}.`);
        window.location.href = 'index.html'; // Kembali ke home
    }

    function handleLoss() {
        clearInterval(timerInterval);
        alert('Game Over! Anda telah membuat 5 kesalahan.');
        window.location.href = 'index.html'; // Kembali ke home
    }

    function saveToLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('sudokuLeaderboard')) || {};
        if (!leaderboard[difficulty]) {
            leaderboard[difficulty] = [];
        }
        const newScore = { name: playerName, time: timeInSeconds };
        leaderboard[difficulty].push(newScore);
        leaderboard[difficulty].sort((a, b) => a.time - b.time);
        leaderboard[difficulty] = leaderboard[difficulty].slice(0, 5);
        localStorage.setItem('sudokuLeaderboard', JSON.stringify(leaderboard));
    }

    // --- Fungsi Bantuan yang Sebelumnya Hilang ---
    function isGameWon() { return board.flat().every(cell => cell !== 0); }

    function clearHighlights() { document.querySelectorAll('.cell').forEach(c => c.classList.remove('highlight-related', 'highlight-same-number')); }

    function highlightPeers(cell) {
        clearHighlights();
        const num = cell.textContent;
        if (!num) return;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        document.querySelectorAll('.cell').forEach(c => {
            const cRow = parseInt(c.dataset.row);
            const cCol = parseInt(c.dataset.col);
            if (cRow === row || cCol === col) c.classList.add('highlight-related');
            if (c.textContent === num) c.classList.add('highlight-same-number');
        });
    }

    function checkNumberCompletion(num) {
        let count = board.flat().filter(val => val == num).length;
        const numberButton = numberPaletteElement.querySelector(`[data-number='${num}']`);
        if (count === 9) numberButton.classList.add('disabled');
        else numberButton.classList.remove('disabled');
    }

    // --- FUNGSI TIMER YANG HILANG ---
    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeInSeconds++;
            updateTimerDisplay();
        }, 1000);
    }

    function updateTimerDisplay() {
        timerElement.textContent = formatTime(timeInSeconds);
    }

    function formatTime(seconds) {
        if (isNaN(seconds) || seconds === null) return "00:00";
        const min = Math.floor(seconds / 60).toString().padStart(2, '0');
        const sec = (seconds % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    }

    function updateMistakesDisplay() {
        mistakesElement.textContent = `${mistakes} / 5`;
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function isValid(grid, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num || grid[x][col] === num) return false;
        }
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[startRow + i][startCol + j] === num) return false;
            }
        }
        return true;
    }

    init(); // Mulai game
}); 