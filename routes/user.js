const express = require('express');
const auth = require('../middleware/auth');
const userController = require('../controllers/user');

const router = express.Router();

/* get all */
router.get('/users', auth, userController.getUsers);

/* get all attendance dates */
router.get('/users/:userId/attendance/', auth, userController.getUserAttendanceDates);

/* get one */
router.get('/users/:userId', auth, userController.getUser);


/* use POST for CREATE operations. */
router.post('/users/', auth, userController.postUser);

/*   use PUT for UPDATE operations. */
router.put('/users/:userId', auth, userController.putUser);

/* use POST for DELETE operations. */
router.delete('/users/:userId', auth, userController.deleteUser);


module.exports = router;
