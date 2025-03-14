require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
// Allow both origins: 127.0.0.1 and localhost
const allowedOrigins = ['http://127.0.0.1:8080', 'http://localhost:8080'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS not allowed'));
        }
    },
    credentials: true
}));

// MySQL Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected...");
});


// Register User
app.post('/register', async (req, res) => {
    
    const { voter_id, role, password } = req.body;
    
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO voters (voter_id, role, password) VALUES (?, ?, ?)";
    db.query(query, [voter_id, role, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "User registered successfully!" });
    });
});

// Login User
app.post('/login', (req, res) => {
    const { voter_id, password } = req.body;

    const query = "SELECT * FROM voters WHERE voter_id = ?";
    db.query(query, [voter_id], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: "User not found!" });

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials!" });

        // Generate JWT Token
        const token = jwt.sign( { voter_id: user.voter_id, role: user.role } , process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: "Login successful!", token, role: user.role });
    });
});


// Start the Server
app.listen(5000, () => {
    console.log("Server running on port 5000...");
});
