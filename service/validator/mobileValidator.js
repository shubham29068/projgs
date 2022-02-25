const Joi = require("joi").extend(require("@joi/date"));

class ValidatorService {
    constructor() {
        this.schemas = {};
        this.initializeScemas();
    }
    initializeScemas() {
        // AUTH
        this.schemas.MobSignup = Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            confirmEmail: Joi.string().valid(Joi.ref('email')).required().messages({ "any.only": `Confirm email not equal to email` }),
            role: Joi.string().valid('user').default('user')
        }).required();
        // Verify
        this.schemas.MobVerify = Joi.object({
            // email: Joi.string().email().required(),
            token: Joi.string().required(),
        }).required();
        // Login
        this.schemas.MobLogin = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }).required();
        // Set Password
        this.schemas.MobSetPassword = Joi.object({
            // otp: Joi.string().pattern(/^[0-9]+$/, { name: 'numbers' }).length(4).allow(null, ''),
            token: Joi.string().required(),
            password: Joi.string().required(),
            confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({ "any.only": `Confirm password not equal to password` }),
        }).required();
        // Forget Password
        this.schemas.MobForgetPassword = Joi.object({
            email: Joi.string().email().required(),
            otp: Joi.string().pattern(/^[0-9]+$/, { name: 'numbers' }).length(4).required(),
        }).required();
        // Forget Password
        this.schemas.MobVerifyOTP = Joi.object({
            email: Joi.string().email().required(),
            otp: Joi.string().pattern(/^[0-9]+$/, { name: 'numbers' }).length(4).required(),
        }).required();
        // Change Password
        this.schemas.MobChangePassword = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({ "any.only": `Confirm password not equal to password` }),
            // otp: Joi.string().pattern(/^[0-9]+$/, { name: 'numbers' }).length(4).required(),
        }).required();
        this.schemas.MobUserUpdate = Joi.object({
            firstName: Joi.string().allow('', null),
            lastName: Joi.string().allow('', null),
            // email: Joi.string().email().allow('', null),
            dob: Joi.date().utc().format("YYYY-MM-DD").less('now'),
            gender: Joi.string().valid("male", "female"),
            linkedAccount: Joi.object({
                facebook: Joi.string().allow('', null),
                twitter: Joi.string().allow('', null),
                linkedin: Joi.string().allow('', null),
                instagram: Joi.string().allow('', null),
                tiktok: Joi.string().allow('', null)
            }),
            cliftonStrenghts: Joi.array().unique().items(Joi.string()),
            disc: Joi.array().unique().items(Joi.string()),
            gift: Joi.array().unique().items(Joi.string()),
            passions: Joi.string().allow('', null)
        }).required();
        this.schemas.MobMOQAwnser = Joi.object({
            _id: Joi.string().required(),
            options: Joi.array().items(Joi.object({
                option: Joi.string().required(),
                selected: Joi.bool().required(),
            })),
            spanishOptions: Joi.array().items(Joi.object({
                option: Joi.string().required(),
                selected: Joi.bool().required(),
            })),
        }).required();
        this.schemas.MobFINBAwnser = Joi.object({
            _id: Joi.string().required(),
            options: Joi.array().items(Joi.object({
                option: Joi.string().required(),
            })),
            spanishOptions: Joi.array().items(Joi.object({
                option: Joi.string().required(),
            })),
        }).required();
        this.schemas.MobLikeDiscussionMsg = Joi.object({
            discussionId: Joi.string().required(),
            activityType: Joi.string().valid("like").required(),
        }).required();

        this.schemas.MobReportDiscussionMsg = Joi.object({
            discussionId: Joi.string().required(),
            reportMessage: Joi.string().required(),
            activityType: Joi.string().valid("report").required(),
        }).required();

        this.schemas.MobReplyDiscussionMsg = Joi.object({
            discussionId: Joi.string().required(),
            message: Joi.string().required(),
        });
        this.schemas.MobPost = Joi.object({
            post: Joi.string().required(),
        });
        this.schemas.MobPostLike = Joi.object({
            postId: Joi.string().required(),
            activityType: Joi.string().valid("like").required(),
        });
        this.schemas.MobPostComment = Joi.object({
            // UserId: Joi.string().required(),
            postId: Joi.string().required(),
            comment: Joi.string().required(),
        })
        this.schemas.MobLikeComment = Joi.object({
            commentId: Joi.string().required(),
            activityType: Joi.string().valid("like").required(),
        })
        this.schemas.MobReplyComment = Joi.object({
            commentId: Joi.string().required(),
            comment: Joi.string().required(),
        })
    }
}
module.exports = ValidatorService

