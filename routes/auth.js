const express = require('express')
// const { post } = require('../app')
const router = express.Router()
const AuthController = require('../controller/auth');
const authController = new AuthController();


router.route('/signup')
    .post(authController.Signup);

router.route('/login')
    .post(authController.Login);

router.route('/verify')
    .post(authController.verify);

router.route('/setpassword')
    .post(authController.setPassword);

router.route('/forgetpassword')
    .post(authController.forgetPassword);

router.route('/verifyotp')
    .post(authController.verifyOTP);

router.route('/changepassword')
    .post(authController.changePassword);



module.exports = router