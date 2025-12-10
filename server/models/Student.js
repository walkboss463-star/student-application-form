const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },

  // Country saved as simple string (from dynamic API)
  country: { type: String, required: true },

  contactNumber: { type: String },

  state: { type: String },
  city: { type: String },

  gender: { type: String },

  educationType: { type: String },  // "PUC" or "Diploma"
  pucStream: { type: String },      // if PUC
  diplomaBranch: { type: String },  // if Diploma

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);
