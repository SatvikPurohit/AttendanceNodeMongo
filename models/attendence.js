const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Data Types and required
const attendanceSchema = new Schema({
  date: {
    required: true,
    type: String
  },
  // let's create a reference to the owner model
  users: [{
    required: true,
    // the type is going to be just an id
    type: mongoose.Schema.Types.ObjectId,
    // but it will refer to the User model
    // (the first parameter to the mongoose.model method)
    ref: "User"
  }]
})


module.exports = mongoose.model('Attendance', attendanceSchema);
