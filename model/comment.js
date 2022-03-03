const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    postId: {
        type: mongoose.Types.ObjectId,
        ref: 'post'
    },
    commentId: {
        type: mongoose.Types.ObjectId,
        ref: 'Comment',
    },
    comment: {
        type: String,
        required: true,
    },
    like: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Comment', commentSchema);

