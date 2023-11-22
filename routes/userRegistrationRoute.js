const express = require('express')
const router = express.Router()

//const {addCategory} = require('../controllers/categoriesController')
const userRegistrationController = require('../controllers/userRegistrationController')
router.route('/')
    .post(userRegistrationController.handleUserRegisteration)
    
module.exports = router