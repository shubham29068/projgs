const mongoose = require('mongoose')
const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    post: {
        type: String,
        required: true
    },
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    like: {
        type: Number,
        default: 0
    },
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('post', postSchema);