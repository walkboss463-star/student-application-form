const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// create a submission
router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    console.error("🔥 Mongoose Validation Error:", err);  // <-- LOG REAL ERROR
    res.status(400).json({
      message: err.message,
      error: err
    });
  }
});

// list submissions (most recent first)
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 }).limit(200);
    res.json(students);
  } catch (err) {
    console.error("🔥 Error fetching students:", err);
    res.status(500).json({ message: err.message });
  }
});

// get single submission by id
router.get('/:id', async (req, res) => {
  try {
    const s = await Student.findById(req.params.id);
    if (!s) return res.status(404).json({ message: 'Not found' });
    res.json(s);
  } catch (err) {
    console.error("🔥 Error fetching student by ID:", err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
