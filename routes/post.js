const express = require('express');
const router = express.Router();
const PostController = require('../controller/postcontroller');
const postController = new PostController();
// const { upload } = require('../../services/upload.services');
const { Auth } = require('../middleware/index');

router.route('/')
    .post(Auth('isUser'), postController.add)
    .get(Auth('isUser'), postController.get);

router.route('/like')
    .post(Auth('isUser'), postController.like)

router.route('/comment')
    .post(Auth('isUser'), postController.comment)

router.route('/comment/like')
    .post(Auth('isUser'), postController.commentLike)

router.route('/comment/reply')
    .post(Auth('isUser'), postController.commentReply)

module.exports = router;
