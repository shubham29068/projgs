// ========= services ===========
// const DbService = require('../services/DB.services');
// const dbService = new DbService();
// ========= NPM packages ===========
const jwt = require('jsonwebtoken');
const constant = require('../db/constant')
// ========= DB ===========
// const { UserModel } = require('../models');
module.exports = (...args) => async (req, res, next) => {
    try {
        if (!args.length) { throw "Invalid Role" }
        const token = req.headers.authorization.split(" ")[1]
        const decodedToken = jwt.verify(token, constant.JWT_SECRET);
        if (args[0] === 'isAdminOrTeacher') {
            // if(decodedToken.role !== "teacher" && decodedToken.role !== "admin") throw Error
            const User = await dbService.find(UserModel, { _id: decodedToken._id});
            if(!User[0]) throw Error
            req.user = User[0];
            return next();
            // if(User[0].role == "teacher" || User[0].role == "admin"){
            //     req.user = User[0];
            //     return next();
            // }else{
            //     throw Error
            // }
        }
        if (args[0] === 'isUser') {
            // if(decodedToken.role !== "user") throw Error
            const User = await dbService.find(UserModel, { _id: decodedToken._id});
            if(!User[0]) throw Error
            if(User[0].role === "user" && User[0].isVerified == true && User[0].isPasswordSet == true ){
                req.user = User[0];
                return next();
            }else{
                throw Error
            }
        }
        if (args[0] === 'islogin') {
            // const User = await db.select('*').from('users').where({ phoneNo: decodedToken.username, type_user: decodedToken.type_user });
            // console.log('User', User)
            // req.user = User.dataValues;
            // return next();
            const User = await dbService.find(UserModel, { _id: decodedToken._id});
            if(!User[0]) throw Error
            req.user = User[0];
            return next();
        }
        throw "Auth Failed"
    } catch (error) {
        res.status(401).json({
            message: "Auth Failed! "
        })
    }
}