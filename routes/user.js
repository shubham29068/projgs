const express = require('express');
const router = express.Router();
const UserController = require('../controller/user');
const userController = new UserController();
const { upload } = require('../service/validator/uploadService');
const { Auth } = require('../middleware/index');

router.route('/')
    .get(Auth('isUser'), userController.Get)
    .put(Auth('isUser'), upload.single('profileImage'), userController.Update);

// router.route('/favourite')
//     .get(Auth('isUser'),userController.Favourite);

// router.route('/bookmark')
//     .get(Auth('isUser'),userController.Bookmark);

// router.route('/like')
//     .get(Auth('isUser'),userController.Like);


module.exports = router;