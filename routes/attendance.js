const express = require('express');
const attendanceController = require('../controllers/attendance');
const auth = require('../middleware/auth');

const router = express.Router();


/* get all users for a date*/
router.get('/attendances/', auth, attendanceController.getUsersForAttendanceDate);

/*   use PUT for UPDATE operations. */
router.put('/attendances/', auth, attendanceController.putAttendance);

/* use POST for DELETE operations. */
router.delete('/attendances/:attendanceId/user/:userId', auth, attendanceController.deleteAttendance);



module.exports = router;
