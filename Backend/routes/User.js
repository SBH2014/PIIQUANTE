const express = require('express');
const router = express.Router()
const userCtrl = require('../controllers/User')
const checkPassword = require('../middleware/check_password')

router.post('/signup', checkPassword , userCtrl.signup) ;
router.post('/login', userCtrl.login) 

module.exports = router;