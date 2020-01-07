const Attendance = require('../models/attendence');
const User = require('../models/user')
const Moment = require('moment');

/* get all users by  attendance date OR attendace dates of a user */
exports.getUsersForAttendanceDate = (req, res, next) => {
  // passed date or todays date
  let date = req.query.date || Moment().format("DD/MM/YYYY");

  Attendance
    .findOne({ date })
    .populate('users', 'name lastName imageUrl mobile _id')
    .then((attendance) => {
      res.send(attendance);
    }).catch((err) => {
      return res.status(500).send({
        message: err.message || "Could not mark attendance"
      });
    });
};

/* 'Update' attendance for user else 'Create' */
exports.putAttendance = (req, res, next) => {
  // passed date or todays date
  const date = req.body.date || Moment().format("DD/MM/YYYY");
  const userId = req.body.userId;

  // Add current date if not present
  Attendance.findOneAndUpdate(
    { date },
    { $push: { users: userId }, date },
    {
      upsert: true,
      new: true
    }
  ).then(attendance => {

    if (!attendance) {
      return res.status(404).send({
        message: "Attendance not found"
      });
    };

    // add attendance id to user
    User.findByIdAndUpdate(
      userId,
      { $push: { attendances: attendance._id } }
    ).then(() => {
      res.send(attendance);
    })

  }).catch(err => {
    return res.status(500).send({
      message: err.message || "Could not mark attendance"
    });
  });
};

/*
 use DELETE for DELETE operations.
 remove attendance by date
*/
exports.deleteAttendance = (req, res) => {
  const attendanceId = req.params.attendanceId;
  const userId = req.params.userId;

  Attendance.findByIdAndUpdate(
    attendanceId,
    { $pull: { users: userId } }
  )
    .then(attendance => {
      if (!attendance) {
        return res.status(404).send({
          message: "Attendance not found"
        });
      };

      // remove attendance id from user
      User.findByIdAndUpdate(
        userId,
        { $pull: { attendances: attendance._id } }
      ).then(() => {
        res.send({ message: "Attendance deleted successfully!" });
      });

    }).catch(err => {
      return res.status(500).send({
        message: err.message || "Could not delete attendance"
      });
    });
};
