const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const authenticateToken = require('./middleware/auth');

const app = express();
const PORT = 5000;

// --- MIDDLEWARE ---
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // URL Vite Frontend Anda
  credentials: true,               // Wajib true untuk pengiriman cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));

// --- API AUTHENTICATION ---

// 1. Register User
app.post('/api/register', async (req, res) => {
  const { gmail, username, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    await pool.query(
      'INSERT INTO users (gmail, username, password) VALUES ($1, $2, $3)',
      [gmail, username, hashedPassword]
    );
    res.status(201).json({ message: "Registrasi berhasil" });
  } catch (err) {
    res.status(500).json({ error: "Gagal register: " + err.message });
  }
});

// 2. Login User (Kunci Perbaikan Proteksi)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(400).json({ message: "User tidak ditemukan" });

    const validPass = await bcrypt.compare(password, result.rows[0].password);
    if (!validPass) return res.status(400).json({ message: "Password salah" });

    // Pastikan secret key 'KODE_RAHASIA_UTS' sama dengan di middleware/auth.js
    const token = jwt.sign({ id: result.rows[0].id }, 'KODE_RAHASIA_UTS', { expiresIn: '1h' });
    
    // PERBAIKAN: httpOnly dibuat false agar frontend bisa membaca token 
    // untuk keperluan proteksi 404 pada pencarian manual URL.
    res.cookie('token', token, { 
      httpOnly: false, 
      secure: false, // Set false untuk localhost
      sameSite: 'lax',
      maxAge: 3600000 // 1 jam
    }); 

    res.json({ 
      message: "Login berhasil", 
      token: token,
      user: { username: result.rows[0].username } 
    });
  } catch (err) {
    res.status(500).json({ error: "Server error saat login" });
  }
});

// --- MAHASISWA CRUD API (Terproteksi authenticateToken) ---

// 3. Tampilkan Semua Mahasiswa
app.get('/api/mahasiswa', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mhs_tb ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data mahasiswa" });
  }
});

// 4. Tambah Mahasiswa
app.post('/api/mahasiswa', authenticateToken, async (req, res) => {
  const { name, nim, jurusan, ipk, isactive } = req.body;
  try {
    // Gunakan parseFloat untuk memastikan IPK adalah angka desimal
    await pool.query(
      'INSERT INTO mhs_tb (name, nim, jurusan, ipk, isactive) VALUES ($1, $2, $3, $4, $5)',
      [name, nim, jurusan, parseFloat(ipk), isactive ?? true]
    );
    res.status(201).json({ message: "Mahasiswa berhasil ditambahkan" });
  } catch (err) {
    res.status(500).json({ error: "Gagal menambah data: " + err.message });
  }
});

// 5. Update Mahasiswa & Status
app.put('/api/mahasiswa/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, nim, jurusan, ipk, isactive } = req.body;
  try {
    await pool.query(
      'UPDATE mhs_tb SET name=$1, nim=$2, jurusan=$3, ipk=$4, isactive=$5 WHERE id=$6',
      [name, nim, jurusan, parseFloat(ipk), isactive, id]
    );
    res.json({ message: "Data mahasiswa diperbarui" });
  } catch (err) {
    res.status(500).json({ error: "Gagal update: " + err.message });
  }
});

// 6. Hapus Mahasiswa
app.delete('/api/mahasiswa/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM mhs_tb WHERE id = $1', [id]);
    res.json({ message: "Mahasiswa berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus data" });
  }
});

// 7. Logout (Hapus Cookie)
app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: "Berhasil logout" });
});

app.listen(PORT, () => {
  console.log(`Backend UTS berjalan di http://localhost:${PORT}`);
});