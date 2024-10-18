// Import modul yang diperlukan
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/auth'); // Pastikan file ini ada di folder routes
const path = require('path');

const app = express();

// Set view engine ke EJS
app.set('view engine', 'ejs');

// Middleware untuk parsing JSON dan URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup session
app.use(session({
    secret: 'secret', // Ganti dengan secret yang lebih aman
    resave: false,
    saveUninitialized: true
}));

// Middleware untuk menyajikan file statis
app.use(express.static(path.join(__dirname, 'public')));

// Middleware untuk memeriksa session pengguna
app.use((req, res, next) => {
    if (!req.session.user && req.path !== '/auth/login' && req.path !== '/auth/register') {
        return res.redirect('/auth/login'); // Redirect ke login jika tidak ada session
    } else if (req.session.user && req.path === '/') {
        return res.redirect('/auth/profile'); // Redirect ke profile jika sudah login
    }
    next(); // Lanjut ke middleware berikutnya
});

// Rute untuk autentikasi
app.use('/auth', authRoutes);

// Rute utama
app.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/auth/profile'); // Redirect ke profile jika sudah login
    } else {
        return res.redirect('/auth/login'); // Redirect ke login jika belum login
    }
});

// Menjalankan server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000'); // Menampilkan pesan dengan link localhost
});
