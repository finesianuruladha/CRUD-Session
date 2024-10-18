// Mengimpor modul yang diperlukan
const express = require('express'); // Framework untuk membangun aplikasi web
const router = express.Router(); // Membuat instance router dari Express
const bcrypt = require('bcryptjs'); // Modul untuk hashing dan membandingkan password
const db = require('../config/db'); // Mengimpor konfigurasi koneksi database

// Rute untuk menampilkan halaman pendaftaran
router.get('/register', (req, res) => {
    res.render('register'); // Merender halaman register
});

// Rute untuk menangani proses pendaftaran
router.post('/register', (req, res) => {
    const { username, email, password } = req.body; // Mengambil data dari body permintaan
    const hashedPassword = bcrypt.hashSync(password, 10); // Menghash password dengan bcrypt

    // Query untuk menyimpan pengguna baru ke dalam database
    const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) throw err; // Menangani kesalahan query
        res.redirect('/auth/login'); // Mengalihkan pengguna ke halaman login setelah pendaftaran
    });
});

// Rute untuk menampilkan halaman login
router.get('/login', (req, res) => {
    res.render('login'); // Merender halaman login
});

// Rute untuk menangani proses login
router.post('/login', (req, res) => {
    const { username, password } = req.body; // Mengambil data dari body permintaan
    const query = "SELECT * FROM users WHERE username = ?"; // Query untuk mencari pengguna berdasarkan username
    db.query(query, [username], (err, result) => {
        if (err) throw err; // Menangani kesalahan query

        if (result.length > 0) { // Jika pengguna ditemukan
            const user = result[0]; // Mengambil data pengguna pertama
            // Membandingkan password yang dimasukkan dengan yang tersimpan
            if (bcrypt.compareSync(password, user.password)) {
                req.session.user = user; // Menyimpan data pengguna dalam sesi
                res.redirect('/auth/profile'); // Mengalihkan ke halaman profil
            } else {
                res.send('Incorrect password'); // Jika password salah
            }
        } else {
            res.send('User not found'); // Jika pengguna tidak ditemukan
        }
    });
});

// Rute untuk menampilkan halaman profil pengguna
router.get('/profile', (req, res) => {
    if (req.session.user) { // Memeriksa apakah pengguna sudah terautentikasi
        res.render('profile', { user: req.session.user }); // Merender halaman profil dengan data pengguna
    } else {
        res.redirect('/auth/login'); // Jika tidak terautentikasi, alihkan ke halaman login
    }
});

// Rute untuk menangani proses logout
router.get('/logout', (req, res) => {
    req.session.destroy(); // Menghancurkan sesi pengguna
    res.redirect('/auth/login'); // Mengalihkan ke halaman login setelah logout
});

// Mengekspor router untuk digunakan di file lain
module.exports = router;
