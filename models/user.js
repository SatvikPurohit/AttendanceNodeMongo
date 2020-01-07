const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Data Types and required
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  dob: String,
  email: String,
  mobile: {
    type: Number,
    required: true
  },
  imageUrl: String,
  membershipStart: String,
  membershipEnd: String,
  timeStamp: String,
  id: String,
  attendances: [{
    // the type is going to be just an id
    type: mongoose.Schema.Types.ObjectId,
    // but it will refer to the Attendance model
    // (the first parameter to the mongoose.model method)
    ref: "Attendance"
  }]
})


module.exports = mongoose.model('User', userSchema);
