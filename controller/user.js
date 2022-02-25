// ------------------ Packages -------------------------
// ------------------ Services -------------------------
const ValidatorService = require('../service/validator/mobileValidator');
const validatorService = new ValidatorService();
// const DbService = require('../../services/DB.services');
// const dbService = new DbService();
const { UploadService } = require('../service/validator/uploadService');
const uploadService = new UploadService();
// ------------------ Model -------------------------
// const { UserModel,UserActivityModel } = require('../../models');
// ------------------ constant -------------------------
// const constant = require('../../db/constant');
// const mobileMessages = require('../../db/messages/mobile.messages');

module.exports = UserController = function () {
    this.Get = async (req, res) => {
        try {
            req.user = JSON.parse(JSON.stringify(req.user))
            delete req.user.password
            return res.status(200).json({ success: true, message: mobileMessages.USER_GET_SUCCESSFULLY, data: req.user });
        } catch (err) {
            console.log('err', err)
            return res.status(201).json({ success: false, message: err });
        }
    }
    this.Update = async (req, res) => {
        try {
            if(req.body.linkedAccount && typeof req.body.linkedAccount == "string"){ req.body.linkedAccount = JSON.parse(req.body.linkedAccount) };
            if(req.body.cliftonStrenghts && typeof req.body.cliftonStrenghts == "string"){ req.body.cliftonStrenghts = JSON.parse(req.body.cliftonStrenghts) };
            if(req.body.disc && typeof req.body.disc == "string"){ req.body.disc = JSON.parse(req.body.disc) };
            if(req.body.gift && typeof req.body.gift == "string"){ req.body.gift = JSON.parse(req.body.gift) };
            const validate = await validatorService.schemas.MobUserUpdate.validate(req.body);
            if (validate.error) { throw validate.error.details[0].message };
            if(req.file && req.file.originalname){
                req.file.originalname = `${Date.now()}${req.file.originalname.replaceAll(' ','_').replaceAll('#', '_')}`;
                validate.value.profileImage = await uploadService.azureFileUpload({file:req.file,containerName:constant.AZURE_CONTAINER_NAME});
            }
            update = await dbService.update(UserModel,{_id:req.user._id},validate.value);
            return res.status(200).json({ success: true, message: mobileMessages.USER_UPDATE_SUCCESSFULLY, data: validate.value });
        } catch (err) {
            console.log('err', err)
            return res.status(201).json({ success: false, message: err });
        }
    }
    this.Favourite = async (req, res) => {
        try {
            let favourite;
            let favouriteCousesList=[];
            let agg = [
                { $match: {userId: mongoose.Types.ObjectId(req.user._id),activityType:"favourite"} },
                courseAgg(req.user._id),
                { $unwind: "$course" },
                {
                    $project:{
                        course:1,
                    }
                }
            ];
            favourite = await dbService.aggregate(UserActivityModel,agg);
            for (let i = 0; i < favourite.length; i++) {
                favouriteCousesList.push(favourite[i].course)
            }
            return res.status(200).json({ success: true, message: mobileMessages.USER_FAVOURITE_GET, data: favouriteCousesList });
        } catch (err) {
            console.log('err', err)
            return res.status(201).json({ success: false, message: err });
        }
    }
    this.Bookmark = async (req, res) => {
        try {
            let bookmark;
            let bookmarkCousesList=[];
            let agg = [
                { $match: {userId: mongoose.Types.ObjectId(req.user._id),activityType:"bookmark"} },
                await courseAgg(req.user._id),
                { $unwind: "$course" },
                {
                    $project:{
                        course:1,
                    }
                }
            ];
            bookmark = await dbService.aggregate(UserActivityModel,agg);
            for (let i = 0; i < bookmark.length; i++) {
                bookmarkCousesList.push(bookmark[i].course)
            }
            return res.status(200).json({ success: true, message: mobileMessages.USER_BOOKMAEK_GET, data: bookmarkCousesList });
        } catch (err) {
            console.log('err', err)
            return res.status(201).json({ success: false, message: err });
        }
    }

    this.Like = async (req, res) => {
        try {
            let like;
            let likeCousesList=[];
            let agg = [
                { $match: {userId: mongoose.Types.ObjectId(req.user._id),activityType:"like"} },
                courseAgg(req.user._id),
                { $unwind: "$course" },
                {
                    $project:{
                        course:1,
                    }
                }
            ];
            like = await dbService.aggregate(UserActivityModel,agg);
            for (let i = 0; i < like.length; i++) {
                likeCousesList.push(like[i].course)
            }
            return res.status(200).json({ success: true, message: mobileMessages.USER_LIKE_GET, data: likeCousesList });
        } catch (err) {
            console.log('err', err)
            return res.status(201).json({ success: false, message: err });
        }
    }
}
function courseAgg(userId) {
    return {
        $lookup: {
            from: "courses",
            // localField: "courseId",
            // foreignField: "_id",
            let: { courseId: "$courseId" },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{ $eq: ["$_id", "$$courseId"] }],
                        },
                    },
                },
                {
                    $lookup: {
                        from: "weeks",
                        let: { courseId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [{ $eq: ["$courseId", "$$courseId"] }],
                                    },
                                },
                            },
                            {
                                $lookup: {
                                    from: "lessons",
                                    let: { weekId: "$_id" },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [{ $eq: ["$weekId", "$$weekId"] }],
                                                },
                                            },
                                        },
                                        {
                                            $lookup: {
                                                from: "chapters",
                                                let: { lessonId: "$_id" },
                                                pipeline: [
                                                    {
                                                        $match: {
                                                            $expr: {
                                                                $and: [{ $eq: ["$lessonId", "$$lessonId"] }],
                                                            },
                                                        },
                                                    },
                                                ],
                                                as: "chapters"
                                            }
                                        },
                                        { $addFields: { NoOfChapter: { $size: "$chapters" } } },
                                        { $addFields: { videoLengthSum: { $sum: "$chapters.video.length" } } },
                                        { $addFields: { audioLengthSum: { $sum: "$chapters.audio.length" } } },
                                        { $addFields: { totalLength: { $add: ['$audioLengthSum', '$videoLengthSum'] } } },
                                    ],
                                    as: "lessons"
                                }
                            },
                            { $addFields: { NoOfLesson: { $size: "$lessons" } } },
                            { $addFields: { totalNoOfChapter: { $sum: "$lessons.NoOfChapter" } } },
                            { $addFields: { totalLength: { $sum: "$lessons.totalLength" } } },
                        ],
                        as: "weeks",
                    },
                },
                { $addFields: { totalNoOfWeek: { $size: "$weeks" } } },
                { $addFields: { totalNoOfLesson: { $sum: "$weeks.NoOfLesson" } } },
                { $addFields: { totalNoOfChapter: { $sum: "$weeks.totalNoOfChapter" } } },
                { $addFields: { totalLength:  { $sum: "$weeks.totalLength" } }  },
                {
                    $lookup: {
                        from: "useractivities",
                        let: { courseId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [{ $eq: ["$courseId", "$$courseId"] },{ $eq: ["$activityType", "like"] },{ $eq: ["$userId", userId] }],
                                    },
                                },
                            },
                        ],
                        as: "likeArray"
                    }
                },
                {
                    $lookup: {
                        from: "useractivities",
                        let: { courseId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [{ $eq: ["$courseId", "$$courseId"] },{ $eq: ["$activityType", "bookmark"] },{ $eq: ["$userId", userId] }],
                                    },
                                },
                            },
                        ],
                        as: "bookmarkArray"
                    }
                },
                {
                    $lookup: {
                        from: "useractivities",
                        let: { courseId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [{ $eq: ["$courseId", "$$courseId"] },{ $eq: ["$activityType", "favourite"] },{ $eq: ["$userId", userId] }],
                                    },
                                },
                            },
                        ],
                        as: "favouriteArray"
                    }
                },
                {
                    $project: {
                        "courseName": 1,
                        "courseImage": 1,
                        "startDate": 1,
                        "totalNoOfWeek": 1,
                        "language": 1,
                        "totalLength": 1,
                        "updatedAt": 1,
                        "views": 1,
                        "rating": 1,
                        "like":1,
                        "isliked":{ $cond: { if: { $gte: [ {$size:"$likeArray"}, 1 ] }, then: true, else: false } },
                        "isbookmarked":{ $cond: { if: { $gte: [ {$size:"$bookmarkArray"}, 1 ] }, then: true, else: false } },
                        "isfavourite":{ $cond: { if: { $gte: [ {$size:"$favouriteArray"}, 1 ] }, then: true, else: false } },
                    }
                },
            ],
            as: "course"
        },
    }
}