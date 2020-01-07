const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();


/* get all */
router.get('/users', userController.getUsers);

/* get all attendance dates */
router.get('/users/:userId/attendance/', userController.getUserAttendanceDates);

/* get one */
router.get('/users/:userId', userController.getUser);


/* use POST for CREATE operations. */
router.post('/users/', userController.postUser);

/*   use PUT for UPDATE operations. */
router.put('/users/:userId', userController.putUser);

/* use POST for DELETE operations. */
router.delete('/users/:userId', userController.deleteUser);


module.exports = router;
