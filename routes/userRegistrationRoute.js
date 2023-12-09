const express = require('express')
const router = express.Router()

const userRegistrationController = require('../controllers/userRegistrationController')
router.route('/')
    .post(userRegistrationController.handleUserRegisteration)
    
module.exports = router