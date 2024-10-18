// Mengimpor dependensi yang diperlukan
const express = require('express'); // Framework web untuk Node.js
const bodyParser = require('body-parser'); // Middleware untuk mengurai data body dalam permintaan
const session = require('express-session'); // Middleware untuk menangani sesi
const authRoutes = require('./routes/auth'); // Mengimpor rute otentikasi dari file terpisah
const path = require('path'); // Modul untuk menangani path file

// Membuat instance aplikasi Express
const app = express();

// Mengatur view engine menggunakan EJS
app.set('view engine', 'ejs');

// Menggunakan body-parser untuk mengurai JSON dan URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Menggunakan express-session untuk mengatur sesi pengguna
app.use(session({
    secret: 'secret', // Kunci rahasia untuk sesi
    resave: false, // Tidak menyimpan kembali sesi yang belum diubah
    saveUninitialized: true // Menyimpan sesi baru yang belum diinisialisasi
}));

// Mengatur folder 'public' sebagai lokasi untuk file statis seperti CSS, gambar, dll.
app.use(express.static(path.join(__dirname, 'public')));

// Middleware untuk mengatur akses ke rute berdasarkan status sesi pengguna
app.use((req, res, next) => {
    // Jika pengguna belum terautentikasi dan tidak mengakses rute login atau register
    if (!req.session.user && req.path !== '/auth/login' && req.path !== '/auth/register') {
        return res.redirect('/auth/login'); // Alihkan ke halaman login
    } 
    // Jika pengguna sudah terautentikasi dan mengakses halaman utama
    else if (req.session.user && req.path === '/') {
        return res.redirect('/auth/profile'); // Alihkan ke profil pengguna
    }
    next(); // Melanjutkan ke middleware berikutnya
});

// Menggunakan rute otentikasi yang diimpor sebelumnya
app.use('/auth', authRoutes);

// Rute untuk halaman utama
app.get('/', (req, res) => {
    // Jika pengguna sudah terautentikasi
    if (req.session.user) {
        return res.redirect('/auth/profile'); // Alihkan ke halaman profil
    } else {
        return res.redirect('/auth/login'); // Jika tidak terautentikasi, alihkan ke halaman login
    }
});

// Menjalankan server di port 3000
app.listen(3000, () => {
    console.log("Server berjalan di port 3000, buka web melalui http://localhost:3000");
});
