const mongoose = require('mongoose')
const userActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    courseId: {
        type: mongoose.Types.ObjectId,
        ref: 'Course',
        // required: true,
    },
    discussionId: {
        type: mongoose.Types.ObjectId,
        ref: 'discussion',
        // required: true,
    },
    postId: {
        type: mongoose.Types.ObjectId,
        ref: 'post',
        // required: true,
    },
    commentId: {
        type: mongoose.Types.ObjectId,
        ref: 'Comment'
    },
    activityType: {
        type: String,
        enum: ["like", "bookmark", "favourite", "report"]
    },
    reportMessage: String

}/* ,
    {
        timestamps: true,
    } */
)

module.exports = mongoose.model('UserActivity', userActivitySchema);

