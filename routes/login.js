const path = require('path');

const express = require('express');

const loginController = require('../controllers/login');

const router = express.Router();

//Admin Login
router.post('/login', loginController.getAuth);

module.exports = router;
