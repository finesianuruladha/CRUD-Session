// Mengimpor modul mysql untuk menghubungkan ke database MySQL
const mysql = require('mysql');

// Membuat koneksi ke database MySQL dengan pengaturan yang diperlukan
const db = mysql.createConnection({
    host: 'localhost', // Alamat host database, di sini menggunakan localhost
    user: 'root', // Nama pengguna untuk mengakses database
    password: '', // Kata sandi untuk pengguna (kosong jika tidak ada kata sandi)
    database: 'user_management', // Nama database yang akan diakses
    port: 3307 // Port yang digunakan untuk menghubungkan ke database, ditambahkan ini untuk mengatur port yang berbeda dari port default (3306)
});

// Menghubungkan ke database dan menangani kesalahan
db.connect((err) => {
    if (err) throw err; // Jika terjadi kesalahan saat koneksi, lemparkan kesalahan
    console.log('Database connected...'); // Jika berhasil, tampilkan pesan di konsol
});

// Mengekspor objek koneksi database agar dapat digunakan di file lain
module.exports = db;


//semua di kasih komentar supaya paham di pertemuan berikutnya