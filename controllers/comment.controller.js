const mongoose = require('mongoose');
const { sendResponse, AppError, catchAsync} = require("../helpers/utils.js");
const Comment = require('../models/Comment.js');
const Post = require('../models/Post.js');
const User = require('../models/User.js');
const commentController = {};

const calculateComment = async(postId) => {
    const commentCount = await Comment.countDocuments({
        post: postId,
        isDeleted: false,
    });
    await Post.findByIdAndUpdate(postId, {commentCount});
}

commentController.createComments = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    console.log("currentUserId",currentUserId)
    const {content,postId} = req.body;

    const posts = Post.findById(postId);
    console.log("posts",posts)
    if(!posts) throw AppError(400,"Post Not Found","Create New Comment Error");

    let comments = await Comment.create({
        author: currentUserId,
        post: postId,
        content
    });

    await calculateComment(postId);
    comments = await comments.populate("author");

    return sendResponse(res,200,true,comments,null,"Create New Comment Successful")
});

commentController.getSingleComment = catchAsync(async (req, res, next) => {  
    const currentUserId = req.userId;
    const commentId = req.params.id;

    let comments = await Comment.findById(commentId);

    if(!comments) throw new AppError(400,"Comment Not Found","Get Single Comment Error");

    return sendResponse(res,200,true,comments,null,"Get Comment Successful")
});

commentController.editComments = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const commentId = req.params.id;
    const { content } = req.body;

    const comments = await Comment.findOneAndUpdate(
        { _id: commentId, author: currentUserId},
        { content },
        { new: true }
    );

    if(!comments) throw new AppError(400,"Content Not Found/User Not Authorized","Update Comment Error");
    
    return sendResponse(res,200,true,comments,null,"Update Post Successful");
})

commentController.deleteComments = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const commentId = req.params.id;

    const comments = await Comment.findOneAndDelete({
        _id: commentId,
        author: currentUserId
    });

    if(!comments) throw new AppError(400,"Comment Not Found/User Not Authorized","Delete Comment Error");

    await calculateComment(comments.post);

    return sendResponse(res,200,true,comments,null,"Delete Successful");
})


module.exports = commentController;