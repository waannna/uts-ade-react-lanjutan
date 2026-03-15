const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Mengambil token dari cookies
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Akses ditolak, silakan login" });
  }

  try {
    // Gunakan Key yang sama dengan index.js
    const verified = jwt.verify(token, 'KODE_RAHASIA_UTS');
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token tidak valid" });
  }
};

module.exports = authenticateToken;