const path = require('path');

const express = require('express');

const loginController = require('../controllers/login');

const router = express.Router();

// /admin/add-product => GET
router.get('/login', loginController.getAuth);

module.exports = router;
