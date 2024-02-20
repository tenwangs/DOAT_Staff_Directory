const express = require('express')

// controller functions
const { loginUser, signupUser, resetPassword, passwordTokenVerification, passwordHashed } = require('../controllers/userController')

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

// password reset route
router.post('/forgotPassword', resetPassword)

// password reset token route
router.get('/forgotPassword/:id/:token', passwordTokenVerification) 

// password reset hashed route
router.post('/forgotPassword/:id/:token', passwordHashed)



module.exports = router