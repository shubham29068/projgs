// ------------------ Packages -------------------------
// ------------------ Services -------------------------
const ValidatorService = require('../service/validator/mobileValidator');
const validatorService = new ValidatorService();
const DbService = require('../service/validator/DbService');
const dbService = new DbService();
const AggregationService = require('../service/validator/aggregation');
const aggregationService = new AggregationService();
// ------------------ Model -------------------------
const { PostModel, UserActivityModel, CommentModel } = require('../model');
// ------------------ constant AND Messages --------------------------
const mobileMessages = require('../db/message/mobile');

module.exports = PostController = function () {
    this.add = async (req, res) => {
        try {
            const validate = await validatorService.schemas.MobPost.validate(req.body);
            // if (validate.error) { throw validate.error.details[0].message };
            validate.value.userId = req.user._id
            let post = await dbService.create(PostModel, validate.value)
            return res.status(200).json({ success: true, message: mobileMessages.POST_ADD, data: post });
        } catch (err) {
            console.log('err', err)
            return res.status(201).json({ success: false, message: err });
        }
    }
    this.get = async (req, res) => {
        try {
            if (req.query && req.query.data && typeof req.query.data === "string") { req.query.data = JSON.parse(req.query.data); }
            let start = (req.query && req.query.data && req.query.data.start) ? parseInt(req.query.data.start) : 0;
            let length = (req.query && req.query.data && req.query.data.length) ? parseInt(req.query.data.length) : 10;
            agg = [
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                { $unwind: "$user" },
                aggregationService.lookup("useractivities", { postId: "$_id" }, [{ $eq: ["$postId", "$$postId"] }, { $eq: ["$userId", req.user._id] }, { $eq: ["$activityType", "like"] }], "likeArray"),
                {
                    $lookup: {
                        from: "comments",
                        let: { postId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [{ $eq: ["$postId", "$$postId"] }],
                                    },
                                },
                            },
                            {
                                $lookup:
                                {
                                    from: "users",
                                    localField: "userId",
                                    foreignField: "_id",
                                    as: "user"
                                }
                            },
                            { $unwind: "$user" },
                            aggregationService.lookup("useractivities", { commentId: "$_id" }, [{ $eq: ["$commentId", "$$commentId"] }, { $eq: ["$userId", req.user._id] }, { $eq: ["$activityType", "like"] }], "likeArray"),
                            {
                                $lookup: {
                                    from: "comments",
                                    let: { commentId: "$_id" },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [{ $eq: ["$commentId", "$$commentId"] }, { $eq: ["$userId", req.user._id] }],
                                                },
                                            },
                                        },
                                        {
                                            $lookup:
                                            {
                                                from: "users",
                                                localField: "userId",
                                                foreignField: "_id",
                                                as: "user"
                                            }
                                        },
                                        { $unwind: "$user" },
                                        aggregationService.lookup("useractivities", { commentId: "$_id" }, [{ $eq: ["$commentId", "$$commentId"] }, { $eq: ["$userId", req.user._id] }, { $eq: ["$activityType", "like"] }], "likeArray"),
                                        {
                                            $project: {
                                                "comment": 1,
                                                "createdAt": 1,
                                                "user": {
                                                    "_id": 1,
                                                    "firstName": 1,
                                                    "lastName": 1,
                                                    "profileImage": 1,
                                                },
                                                "like": 1,
                                                "isliked": { $cond: { if: { $gte: [{ $size: "$likeArray" }, 1] }, then: true, else: false } },
                                            }
                                        }
                                    ],
                                    as: "repiles"
                                }
                            },
                            {
                                $project: {
                                    "comment": 1,
                                    "createdAt": 1,
                                    "like": { $ifNull: ["$like", 0] },
                                    "user": {
                                        "_id": 1,
                                        "firstName": 1,
                                        "lastName": 1,
                                        "profileImage": 1,
                                    },
                                    "repiles": 1,
                                    "noOfReply": { $size: "$repiles" },
                                    "isliked": { $cond: { if: { $gte: [{ $size: "$likeArray" }, 1] }, then: true, else: false } },
                                }
                            },
                        ],
                        as: "comments"
                    }
                },
                {
                    $project: {
                        "post": 1,
                        "like": 1,
                        "user": {
                            "_id": 1,
                            "firstName": 1,
                            "lastName": 1,
                            "profileImage": 1,
                        },
                        "comments": 1,
                        "isliked": { $cond: { if: { $gte: [{ $size: "$likeArray" }, 1] }, then: true, else: false } },
                        "noOfComments": { $size: "$comments" },
                        "createdAt": 1
                    }
                },
                { $sort: { "createdAt": -1 } },
                {
                    $facet: {
                        posts: [{ $skip: start }, { $limit: length }],
                        totalCount: [
                            {
                                $count: 'count'
                            }
                        ]
                    }
                },
            ];
            let posts = await dbService.aggregate(PostModel, agg)
            return res.status(200).json({ success: true, message: mobileMessages.POST_GET, data: { posts: posts[0].posts, recordsTotal: posts[0].totalCount[0].count } });
        } catch (err) {
            console.log('err', err)
            return res.status(201).json({ success: false, message: err });
        }
    }
    this.like = async (req, res) => {
        try {
            const validate = await validatorService.schemas.MobPostLike.validate(req.body);
            if (validate.error) { throw validate.error.details[0].message };
            validate.value.userId = req.user._id;
            let isExist = await dbService.find(UserActivityModel, { userId: validate.value.userId, postId: validate.value.postId });
            if (isExist.length == 0) {
                await dbService.create(UserActivityModel, validate.value);
                if (validate.value.activityType == "like") {
                    await dbService.update(PostModel, { _id: validate.value.postId }, { "$inc": { like: 1 } })
                }
            } else {
                await dbService.delete(UserActivityModel, { _id: isExist[0]._id });
                if (validate.value.activityType == "like") {
                    await dbService.update(PostModel, { _id: validate.value.postId }, { "$inc": { like: -1 } })
                }
            }
            return res.status(200).json({ success: true, message: mobileMessages.Like, data: 1 });
        } catch (err) {
            console.log('err', err)
            return res.status(201).json({ success: false, message: err });
        }
    }
    this.comment = async (req, res) => {
        try {
            const validate = await validatorService.schemas.MobPostComment.validate(req.body);
            if (validate.error) { throw validate.error.details[0].message };
            validate.value.userId = req.user._id;
            let comment = await dbService.create(CommentModel, validate.value);
            return res.status(200).json({ success: true, message: mobileMessages.COMMENT, data: comment });
        } catch (err) {
            console.log('err', err)
            return res.status(201).json({ success: false, message: err });
        }
    }

    this.commentLike = async (req, res) => {
        try {
            let validate = await validatorService.schemas.MobLikeComment.validate(req.body);
            if (validate.error) { throw validate.error.details[0].message };
            validate.value.userId = req.user._id;
            let isExist = await dbService.find(UserActivityModel, { userId: validate.value.userId, commentId: validate.value.commentId })
            if (isExist.length == 0) {
                await dbService.create(UserActivityModel, validate.value);
                if (validate.value.activityType == "like") {
                    await dbService.update(CommentModel, { _id: validate.value.commentId }, { "$inc": { like: 1 } })
                }
            } else {
                await dbService.delete(UserActivityModel, { _id: isExist[0]._id });
                if (validate.value.activityType == "like") {
                    await dbService.update(CommentModel, { _id: validate.value.commentId }, { "$inc": { like: -1 } })
                }
            }
            return res.status(200).json({ success: true, message: mobileMessages.Like, data: 1 });
        } catch (error) {
            console.log('err', error)
            return res.status(201).json({ success: false, message: error });
        }
    }

    this.commentReply = async (req, res) => {
        try {
            let validate = await validatorService.schemas.MobReplyComment.validate(req.body);
            if (validate.error) { throw validate.error.details[0].message };
            validate.value.userId = req.user._id;
            let comment = await dbService.create(CommentModel, validate.value);
            return res.status(200).json({ success: true, message: mobileMessages.Like, data: comment });
        } catch (err) {
            console.log('err', err)
            return res.status(201).json({ success: false, message: err });
        }
    }

}
