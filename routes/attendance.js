const express = require('express');
const attendanceController = require('../controllers/attendance');
const router = express.Router();


/* get all users for a date*/
router.get('/attendances/', attendanceController.getUsersForAttendanceDate);

/*   use PUT for UPDATE operations. */
router.put('/attendances/', attendanceController.putAttendance);

/* use POST for DELETE operations. */
router.delete('/attendances/:attendanceId/user/:userId', attendanceController.deleteAttendance);



module.exports = router;
