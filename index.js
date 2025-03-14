const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const authenticateToken = require("./database/authmiddleware");

require('dotenv').config();
const app = express();

// Serve static files from 'public' (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'src')));

// Serve node_modules (for frontend libraries)
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Serve contract JSON files from build/contracts
app.use('/contracts', express.static(path.join(__dirname, 'build/contracts')));

// Authorization middleware
const authorizeUser = (req, res, next) => {
  console.log(req.query.Authorization.split('Bearer ')[1]);
  const token = req.query.Authorization.split('Bearer ')[1];

  if (!token) {
    return res.status(401).send('<h1 align="center"> Login to Continue </h1>');
  }
  
  try {
    // Verify and decode the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedToken;
    next(); // Proceed to the next middleware
  } catch (error) {
    return res.status(401).json({ message: 'Invalid authorization token' });
  }
};


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/register.html'));
});

app.get('/index', authorizeUser, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/index.html'));
});

// app.get('/admin.html', authorizeUser, (req, res) => {
//   res.sendFile(path.join(__dirname, 'src/html/admin.html'));
// });

// app.get('/dist/login.bundle.js', (req, res) => {
//   res.sendFile(path.join(__dirname, 'src/dist/login.bundle.js'));
// });

// app.get('/dist/app.bundle.js', (req, res) => {
//   res.sendFile(path.join(__dirname, 'src/dist/app.bundle.js'));
// });

// Serve the favicon.ico file
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/favicon.ico'));
});

// Start the server
app.listen(8080, () => {
  console.log('Server listening on http://localhost:8080');
});