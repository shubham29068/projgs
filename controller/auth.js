// ------------------ Packages -------------------------
const bcryptjs = require('bcryptjs');
const randomString = require('randomstring')
// // ------------------ Services -------------------------
const TokenService = require('../service/validator/tokenService');
const tokenService = new TokenService();
const ValidatorService = require('../service/validator/mobileValidator');
const validatorService = new ValidatorService();
const DbService = require('../service/validator/DbService');
const dbService = new DbService();
const MailService = require('../service/validator/mailService');
const mailService = new MailService();

// // ------------------ Model -------------------------
const { UserModel } = require('../model');
// // ------------------ constant -------------------------
const mobileMessages = require('../db/message/mobile');
const constant = require('../db/constant');

module.exports = AuthController = function () {
    this.Signup = async (req, res) => {
        try {
            let signup
            let isExist
            const validate = await validatorService.schemas.MobSignup.validate(req.body);
            if (validate.error) { throw validate.error.details[0].message };
            validate.value.token = await tokenService.create({ email: validate.value.email, role: validate.value.role }, { /* expiresIn: "1h"  */ })
            isExist = await dbService.find(UserModel, { email: validate.value.email });
            if (isExist[0]) {
                if (isExist[0].role === "teacher") {
                    throw mobileMessages.USER_ALREADY_EXIST_AS_TEACHER
                }
                if (isExist[0].isVerified) {
                    throw mobileMessages.USER_ALREADY_EXIST

                } else {
                    signup = await dbService.update(UserModel, { _id: isExist[0]._id }, validate.value);

                    signup = await dbService.find(UserModel, { _id: isExist[0]._id }); signup = JSON.parse(JSON.stringify(signup[0]));
                }
            } else {
                signup = await dbService.create(UserModel, validate.value);
                signup = JSON.parse(JSON.stringify(signup));
            }
            let HTML = `
            <p> Hi ${signup.firstName},</p>
            <p> Thank you for registering for LMS, please validate your email address by clicking on the link <a href="${constant.WEB_BASE_URL}verify-email/${signup.token}">here</a></p>.<br>  
            <p>Thanks,<br>
            LMS Team</p>`
            let subject = `SignUp`

            await mailService.send({ email: signup.email, token: signup.token, html: HTML, subject: subject });


            return res.status(200).json({ success: true, message: mobileMessages.AUTH_LOGIN, data: signup });


        } catch (err) {
            console.log('err', err)
            return res.status(201).json({ success: false, message: err });
        }
    }
    this.Login = async (req, res) => {
        try {
            const validate = await validatorService.schemas.MobLogin.validate(req.body);
            if (validate.error) { throw validate.error.details[0].message };
            const isExist = await dbService.find(UserModel, { email: validate.value.email, role: 'user' });
            if (!isExist[0]) { throw mobileMessages.USER_NOT_EXIST };
            if (!isExist[0].isVerified) { throw mobileMessages.USER_NOT_VERIFY };
            if (!isExist[0].isPasswordSet) { throw mobileMessages.USER_PASSWORD_NOT_SET };
            const isPasswordRight = await bcryptjs.compare(validate.value.password, isExist[0].password);
            if (!isPasswordRight) { throw mobileMessages.AUTH_PASSWORD_NOT_MATCH };
            return res.status(200).json({ success: true, message: mobileMessages.AUTH_LOGIN, data: isExist[0], token: await tokenService.create({ _id: isExist[0]._id }, { /* expiresIn: "1h"  */ }) });
        } catch (err) {
            console.log('err', err)
            return res.status(200).json({ success: false, message: err });
        }
    }
    this.verify = async (req, res) => {
        try {
            const validate = await validatorService.schemas.MobVerify.validate(req.body);
            if (validate.error) { throw validate.error.details[0].message };
            const tokenData = await tokenService.decodedToken(validate.value.token);
            const isExist = await dbService.find(UserModel, { email: tokenData.email });
            if (!isExist[0]) { throw mobileMessages.USER_NOT_EXIST };
            if (isExist[0].token != validate.value.token) { throw mobileMessages.AUTH_INVALID_TOKEN }
            const update = await dbService.update(UserModel, { email: isExist[0].email }, { /* token: "", */ isVerified: true })
            return res.status(200).json({ success: true, message: mobileMessages.AUTH_VERIFY, data: update });
        } catch (err) {
            console.log('err', err)
            return res.status(200).json({ success: false, message: err });
        }
    }
    this.setPassword = async (req, res) => {
        try {
            let user;
            const validate = await validatorService.schemas.MobSetPassword.validate(req.body);
            if (validate.error) { throw validate.error.details[0].message };
            const tokenDecode = await tokenService.decodedToken(validate.value.token);
            const isExist = await dbService.find(UserModel, { email: tokenDecode.email });
            if (!isExist[0]) { throw mobileMessages.USER_NOT_EXIST };
            if (!isExist[0].isVerified) { throw mobileMessages.USER_NOT_VERIFY };
            if (isExist[0].token != validate.value.token) { throw mobileMessages.AUTH_INVALID_TOKEN }
            validate.value.password = await bcryptjs.hash(validate.value.password, 10);
            let update
            update = await dbService.update(UserModel, { _id: isExist[0]._id }, { password: validate.value.password, isPasswordSet: true, token: "" });
            user = JSON.parse(JSON.stringify(isExist[0])); delete user.password;
            return res.status(200).json({ success: true, message: mobileMessages.AUTH_PASSWORD_SET, data: user, token: await tokenService.create({ _id: isExist[0]._id }, { /* expiresIn: "1h"  */ }) });
        } catch (err) {
            console.log('err', err)
            return res.status(200).json({ success: false, message: err });
        }
    }
    this.forgetPassword = async (req, res) => {
        try {
            req.body.otp = randomString.generate({ length: 4, charset: 'numeric' })
            const validate = await validatorService.schemas.MobForgetPassword.validate(req.body);
            if (validate.error) { throw validate.error.details[0].message };
            const isExist = await dbService.find(UserModel, { email: validate.value.email, role: 'user' });
            if (!isExist[0]) { throw mobileMessages.USER_NOT_EXIST };
            if (!isExist[0].isVerified) { throw mobileMessages.USER_NOT_VERIFY };
            const update = await dbService.update(UserModel, { _id: isExist[0]._id }, { otp: validate.value.otp });
            let HTML = `
            <p> Hello ${isExist[0].firstName},</p>
            <p> You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
            <p>Your OTP is ${validate.value.otp}</p>
            <p>Thanks,<br>
            LMS Team</p>
            `;
            let subject = `ForgetPassword`
            await mailService.send({ email: isExist[0].email, html: HTML, subject: subject });
            return res.status(200).json({ success: true, message: mobileMessages.AUTH_FORGET_PASSWORD/* , data: update  */ });
        } catch (err) {
            console.log('err', err)
            return res.status(200).json({ success: false, message: err });
        }
    }
    this.verifyOTP = async (req, res) => {
        try {
            const validate = await validatorService.schemas.MobVerifyOTP.validate(req.body);
            if (validate.error) { throw validate.error.details[0].message };
            const isExist = await dbService.find(UserModel, { email: validate.value.email, role: 'user' });
            if (!isExist[0]) { throw mobileMessages.USER_NOT_EXIST };
            if (isExist[0].otp != validate.value.otp) { throw mobileMessages.AUTH_INVALID_OTP }
            const update = await dbService.update(UserModel, { _id: isExist[0]._id }, { otp: "", isOtpVerified: true });
            return res.status(200).json({ success: true, message: mobileMessages.AUTH_VERIFY_OTP/* , data: update */ });
        } catch (err) {
            console.log('err', err)
            return res.status(200).json({ success: false, message: err });
        }
    }
    this.changePassword = async (req, res) => {
        try {
            const validate = await validatorService.schemas.MobChangePassword.validate(req.body);
            if (validate.error) { throw validate.error.details[0].message };
            const isExist = await dbService.find(UserModel, { email: validate.value.email, role: 'user' });
            if (!isExist[0]) { throw mobileMessages.USER_NOT_EXIST };
            if (!isExist[0].isOtpVerified) { throw mobileMessages.AUTH_OTP_NOT_VERIFY }
            validate.value.password = await bcryptjs.hash(validate.value.password, 10);
            const update = await dbService.update(UserModel, { _id: isExist[0]._id }, { password: validate.value.password, isOtpVerified: false, isPasswordSet: true });
            return res.status(200).json({ success: true, message: mobileMessages.AUTH_VERIFY_OTP, data: isExist[0], token: await tokenService.create({ _id: isExist[0]._id }, { /* expiresIn: "1h"  */ }) });
        } catch (err) {
            console.log('err', err)
            return res.status(200).json({ success: false, message: err });
        }
    }
}

