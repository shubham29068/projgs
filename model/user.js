const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true,
        index: true
    },
    lastName: {
        type: String,
        default: "",
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        index: true
    },
    password: {
        type: String,
        // required: true,
    },
    dob: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ["male", "female"]
    },
    profileImage: {
        type: String,
        default: "",
    },
    linkedAccount: {
        facebook: {
            type: String,
            default: ""
        },
        twitter: {
            type: String,
            default: ""
        },
        linkedin: {
            type: String,
            default: ""
        },
        instagram: {
            type: String,
            default: ""
        },
        tiktok: {
            type: String,
            default: ""
        },
    },
    cliftonStrenghts: [String],
    disc: [String],
    gift: [String],
    passions: {
        type: String,
    },
    role: {
        type: String,
        default: "user"
    },
    deviceType: {
        type: String,
        default: "mobile"
    },
    token: String,
    otp: {
        type: String,
        maxLength: 4,
        minLength: 4
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isPasswordSet: {
        type: Boolean,
        default: false
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('User', userSchema);

