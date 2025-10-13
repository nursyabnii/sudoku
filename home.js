document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('player-name');
    const startBtn = document.getElementById('start-btn');
    const diffBtns = document.querySelectorAll('.diff-btn');

    let selectedDifficulty = 'easy'; // Default

    // Event listener untuk tombol kesulitan
    diffBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            diffBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedDifficulty = btn.dataset.difficulty;
        });
    });

    // Event listener untuk tombol start
    startBtn.addEventListener('click', () => {
        let playerName = nameInput.value.trim();
        if (playerName === '') {
            playerName = 'Guest';
        }
        // Pindah ke halaman game dengan membawa data nama dan kesulitan
        window.location.href = `game.php?name=${encodeURIComponent(playerName)}&difficulty=${selectedDifficulty}`;
    });

    // Fungsi untuk menampilkan leaderboard
    function displayLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('sudokuLeaderboard')) || {};
        const difficulties = ['easy', 'medium', 'hard'];

        difficulties.forEach(diff => {
            const listElement = document.querySelector(`#leaderboard-${diff} ol`);
            listElement.innerHTML = ''; // Kosongkan list

            const scores = leaderboard[diff] || [];

            if (scores.length === 0) {
                listElement.innerHTML = '<li>Belum ada data.</li>';
            } else {
                scores.slice(0, 5).forEach(score => { // Tampilkan top 5
                    const li = document.createElement('li');
                    const time = formatTime(score.time);
                    li.innerHTML = `${score.name} - <span>${time}</span>`;
                    listElement.appendChild(li);
                });
            }
        });
    }

    function formatTime(seconds) {
        if (isNaN(seconds) || seconds === null) return "00:00";
        const min = Math.floor(seconds / 60).toString().padStart(2, '0');
        const sec = (seconds % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    }

    // Tampilkan leaderboard saat halaman dimuat
    displayLeaderboard();
});