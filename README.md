# 🎮 Game Sudoku Berbasis Web
Sebuah game Sudoku klasik yang dibangun menggunakan HTML, CSS, dan JavaScript murni. Proyek ini dilengkapi dengan berbagai fitur modern untuk pengalaman bermain yang lebih baik, termasuk halaman utama, sistem leaderboard, dan beberapa tingkat kesulitan.

 [Play Sudoku](https://sudoku-rho-five.vercel.app/) 👈 

## ✨ Fitur Utama
- Halaman Utama Interaktif: Pengguna dapat memasukkan nama, memilih tingkat kesulitan, dan melihat leaderboard sebelum memulai.
- Tiga Tingkat Kesulitan: Pilih antara Easy, Medium, dan Hard untuk menyesuaikan tantangan.
- Batas Kesalahan: Permainan akan berakhir jika pemain membuat lebih dari 5 kesalahan.
- Leaderboard Lokal: Skor (nama dan waktu) untuk setiap tingkat kesulitan disimpan di localStorage browser, menampilkan 5 skor teratas.
- Highlight Cerdas: Klik pada sebuah kotak untuk menyorot baris, kolom, dan semua angka yang sama di papan, memudahkan pencarian.
- Input Angka Dinamis: Tombol angka di palet akan nonaktif secara otomatis jika angka tersebut sudah lengkap (terisi 9) di papan.
- Desain Responsif: Tampilan game beradaptasi dengan baik di perangkat desktop maupun mobile.

## 🛠️ Teknologi yang Digunakan
- HTML5: Untuk struktur dasar halaman web.
- CSS3: Untuk styling, layout, dan desain responsif.
- JavaScript (ES6+): Untuk semua logika game, interaksi DOM, dan manajemen localStorage.

## 📂 Struktur File
sudoku-game/
├── 📄 index.html      # Halaman utama (Home)
├── 📄 game.html       # Halaman permainan Sudoku
├── 🎨 home.css        # CSS untuk halaman utama
├── 🎨 style.css       # CSS untuk halaman permainan
├── 📜 home.js        # JavaScript untuk halaman utama
└── 📜 script.js       # JavaScript untuk logika permainan Sudoku
🚀 Cara Menjalankan Secara Lokal
Proyek ini tidak memerlukan build tools atau dependencies yang rumit. Anda hanya perlu sebuah browser.

## Clone repository ini:


```git clone https://github.com/username-anda/nama-repo-anda.git```

Masuk ke direktori proyek:
```cd nama-repo-anda```
Buka file index.html langsung di browser favorit Anda (misalnya dengan double-click).

deploy-an
Proyek ini di-deploy sebagai situs statis menggunakan Vercel, yang terintegrasi langsung dengan repository GitHub untuk CI/CD (Continuous Integration/Continuous Deployment) yang mulus. Setiap push ke branch main akan secara otomatis men-trigger deploy-an baru.

## 🧑‍💻 Author
Dibuat oleh Nursyabani.