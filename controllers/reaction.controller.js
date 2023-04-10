const mongoose = require('mongoose');
const { sendResponse, AppError, catchAsync} = require("../helpers/utils.js");
const Task = require('../models/Task.js');
const Reaction = require('../models/Reaction.js');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const reactionController = {};

const calculateReactions = async(targetId,targetType) => {
    const status = await Reaction.aggregate([
        {
            $match: {targetId:mongoose.Types.ObjectId(targetId)},
        },
        {
            $group: {
                _id:"$targetId",
                heart: {
                    $sum: {
                        $cond: [{$eq: ["$emoji","heart"]},1,0],
                    }
                },
            }
        }
    ]);
    const newReactions = {
        heart:(status[0] && status[0].heart) || 0
    }
    await mongoose.model(targetType).findByIdAndUpdate(targetId,{newReactions});
    return newReactions;
}

reactionController.saveReactions = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const {targetType,targetId,emoji} = req.body;

    const targetObject = await mongoose.model(targetType).findById(targetId);
    if(!targetObject) throw new AppError(400,`${targetType} Not Found`,"Create Reaction Error");

    let reactions = await Reaction.findOne({
        targetType,
        targetId,
        author: currentUserId
    });

    if(!reactions) {
        reactions = await Reaction.create({
            targetType,
            targetId,
            author: currentUserId,
            emoji
        });
    } else {
        if(reactions.emoji === emoji) {
            await reactions.delete();
        } else {
            reactions.emoji = emoji;
            await reactions.save();
        }
    }
    
    const newReactions = await calculateReactions(targetId,targetType);
    console.log

    return sendResponse(res,200,true,newReactions,null,"Create Reaction Successful")
})

module.exports = reactionController;