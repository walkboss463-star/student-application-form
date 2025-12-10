require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const studentsRoute = require('./routes/students');
const emailRoute = require('./routes/emailRoute');

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------
// API ROUTES
// ----------------------
app.use('/api/students', studentsRoute);
app.use('/api/email', emailRoute);

// ----------------------
// SERVE FRONTEND BUILD
// ----------------------
app.use(express.static(path.join(__dirname, "build")));

// 🔥 FIXED WILDCARD ROUTE (Using Regex to avoid path-to-regexp errors)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// ----------------------
// START SERVER + MONGODB
// ----------------------
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) =>
    console.error('MongoDB connection error:', err)
  );
