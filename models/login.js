const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Data Types and required
const loginSchema = new Schema({
  uName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})


module.exports = mongoose.model('Login', loginSchema);
