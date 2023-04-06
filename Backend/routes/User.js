const express = require('express');
const router = express.Router()
const {signup,login} = require('../controllers/User')
const checkPassword = require('../middleware/check_password')
const checkEmail = require('../middleware/check_email')

router.post('/signup', checkEmail, checkPassword , signup) ;
router.post('/login', login) 

module.exports = router;