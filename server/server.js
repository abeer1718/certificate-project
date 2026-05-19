const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log(' Connected to MySQL Database Pool');

// ====================== AUTH ROUTES ======================

// Register New User
app.post('/api/register', async (req, res) => {
  const { username, full_name, password } = req.body;

  if (!username || !full_name || !password) {
    return res.status(400).json({ message: 'جميع الحقول مطلوبة' });
  }

  try {
    // Check if username already exists
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
      if (err) return res.status(500).json({ message: 'خطأ في السيرفر' });
      if (results.length > 0) {
        return res.status(400).json({ message: 'اسم المستخدم موجود مسبقاً' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert new user
      db.query(
        'INSERT INTO users (username, full_name, password) VALUES (?, ?, ?)',
        [username, full_name, hashedPassword],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'خطأ في إنشاء الحساب' });
          }

          res.status(201).json({ 
            success: true, 
            message: 'تم إنشاء الحساب بنجاح' 
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).json({ message: 'خطأ في السيرفر' });
    if (results.length === 0) return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name
      }
    });
  });
});

// ====================== CERTIFICATES ======================
app.post('/api/certificates', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'غير مصرح' });

  const token = authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let { 
      certificateNo, 
      date, 
      serialNumber, 
      alloyWeight, 
      alloyCarat, 
      netWeight 
    } = req.body;

    // ====================== التحقق من الحقول المطلوبة ======================
    const errors = [];

    if (!certificateNo || String(certificateNo).trim() === '') {
      errors.push('رقم الشهادة');
    }
    if (!date || String(date).trim() === '') {
      errors.push('التاريخ');
    }
    if (!serialNumber || String(serialNumber).trim() === '') {
      errors.push('الرقم المتسلسل');
    }
    if (!alloyWeight || String(alloyWeight).trim() === '') {
      errors.push('وزن السبيكة');
    }
    if (!alloyCarat || String(alloyCarat).trim() === '') {
      errors.push('عيار السبيكة');
    }
    if (!netWeight || String(netWeight).trim() === '') {
      errors.push('الوزن الصافي');
    }

    // إذا في حقول فاضية
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: `يرجى ملء الحقول التالية: ${errors.join(' - ')}`
      });
    }

    // ====================== تنظيف البيانات ======================
    certificateNo = String(certificateNo).trim();
    serialNumber = String(serialNumber).trim();
    alloyWeight = String(alloyWeight).trim();
    alloyCarat = String(alloyCarat).trim();
    netWeight = String(netWeight).trim();

    // تنظيف وتحويل التاريخ
    if (date) {
      if (date.includes('/') || date.includes('-')) {
        const parts = date.split(/[-/]/);
        if (parts.length === 3) {
          date = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }
    }

    console.log("Received Data:", { 
      certificateNo, date, serialNumber, alloyWeight, alloyCarat, netWeight 
    });

    // ====================== حفظ في قاعدة البيانات ======================
    db.query(
      `INSERT INTO certificates 
       (user_id, certificate_no, date, serial_number, alloy_weight, alloy_carat, net_weight)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [decoded.id, certificateNo, date, serialNumber, alloyWeight, alloyCarat, netWeight],
      (err, result) => {
        if (err) {
          console.error("DB Error:", err);
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ 
              success: false, 
              message: 'رقم الشهادة موجود مسبقاً' 
            });
          }
          return res.status(500).json({ 
            success: false, 
            message: 'خطأ في حفظ البيانات' 
          });
        }

        res.json({ 
          success: true, 
          id: result.insertId, 
          message: ' تم الحفظ بنجاح' 
        });
      }
    );

  } catch (e) {
    console.error("JWT Error:", e);
    res.status(401).json({ message: 'توكن غير صالح' });
  }
});

// ====================== GET ALL CERTIFICATES (FOR REPORTS) ======================
app.get('/api/certificates', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'غير مصرح' });

  const token = authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    db.query(
      `SELECT id, certificate_no, DATE_FORMAT(date, '%d/%m/%Y') as date, serial_number, alloy_weight, alloy_carat, net_weight 
       FROM certificates 
       ORDER BY certificate_no ASC, id DESC`,
      (err, results) => {
        if (err) {
          console.error("DB Error:", err);
          return res.status(500).json({ success: false, message: 'خطأ في جلب البيانات' });
        }
        res.json({ success: true, data: results });
      }
    );
  } catch (e) {
    console.error("JWT Error:", e);
    res.status(401).json({ message: 'توكن غير صالح' });
  }
});

// Start Server
const PORT = process.env.PORT || 5060;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});