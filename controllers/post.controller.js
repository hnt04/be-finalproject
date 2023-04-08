const mongoose = require('mongoose');
const { sendResponse, AppError, catchAsync} = require("../helpers/utils.js");
const Task = require('../models/Task.js');
const User = require('../models/User.js');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const postController = {};

const calculatePost = async(userId) => {
    const postCount = await Post.countDocuments({
        author: userId,
        isDeleted: false,
    });
    await User.findByIdAndUpdate(userId, {postCount});
}

postController.createPosts = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const { content, image } = req.body;

    let posts = await Post.create({
        content,
        image,
        author: currentUserId,
        check: false 
    });
    await calculatePost(currentUserId);

    posts = await Post.findById(posts._id).populate({path:"author",options:{lean:true}}).lean();

    return sendResponse(
        res,200,true,posts,null,"Post have to browse by HR!"
    )

});    

postController.getSinglePost = catchAsync(async (req, res, next) => { 
    const currentUserId = req.userId;
    const postId = req.params.id;

    let posts = await Post.findById(postId)
	if(!posts) throw new AppError(400,"Post Not Found","Get Single Post Error");

    posts = posts.toJSON();
    posts.comments = await Comment.find({posts: posts._id}).populate("author").lean();

    return sendResponse(res,200,true,posts,null,"Get Single Post Success");
});

postController.updatePosts = catchAsync(async (req, res, next) => {
    const postId = req.params.id;
    const currentUserId = req.userId;

    let posts = await Post.findById(postId);
    if(!posts) throw new AppError(400,"Post Not Found","Update Post Error");
    if(!posts.author.equals(currentUserId)) throw new AppError(400,"Only User Can Edit Their Post","Update Post Error");

    const allowed = ["content","image"];
    allowed.forEach((field) => {
        if(req.body[field] !== undefined) {
            posts[field] = req.body[field];
        }
    });

    await posts.save();

    return sendResponse(res,200,true,posts,null,"Update Post Successful!")
});

postController.updateCheckPosts = catchAsync(async (req, res, next) => {
    const postId = req.params.id;
    const currentUserId = req.userId;

    let posts = await Post.findById(postId);
    if(!posts) throw new AppError(400,"Post Not Found","Update Post Error");

    let user = await User.findById(currentUserId);
    const postChecker = user.department === 'HR';
    if(!postChecker) throw new AppError(400,"Only HR can browse this post","Update Post Error");

    const allowed = ["check"];
    allowed.forEach((field) => {
        if(req.body[field] !== undefined) {
            posts[field] = req.body[field];
        }
    });

    await posts.save();

    return sendResponse(res,200,true,posts,null,"Update Post Successful!")
});

postController.deletePosts = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const postId = req.params.id;

    const posts = await Post.findOneAndUpdate(
        { _id: postId, author: currentUserId},
        { isDeleted: true },
        {new:true}
    );

    if(!posts) throw new AppError(400,"Post Not Found/ User Not Authorized","Delete Post Error");
    // await calculatePost(author);
    
    return sendResponse(res,200,true,posts,null,"Delete Post Successful")
});

postController.getPosts = catchAsync(async (req, res, next) => {
    const userId = req.params.userId;

    let { page, limit } = {...req.query};

    let user = await User.findById(userId);
    if(!user) throw new AppError(400,"User Not Found","Get Post Error");
    
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
        
    const filterConditions = [{isDeleted: false}, {check:true}];

    const filterCriteria = filterConditions.length
    ? { $and: filterConditions}
    : {};
    console.log("filterCriteria",filterCriteria)

    const count = await Post.countDocuments(filterCriteria);
    const totalPage = Math.ceil(count/limit);
    const offset = (page - 1)*limit;

    let posts = await Post.find(filterCriteria)
    .sort({createdAt: -1})
    .skip(offset)
    .limit(limit)
    .populate("author");

    sendResponse(res,200,true,{posts,totalPage,count},null,"Filter list of posts success")
});

postController.getUnCheckPosts = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;

    console.log("request",req.userId)

    let currentUser = await User.findById(currentUserId);

    if (currentUser.department !== "HR")
    throw new AppError(
      404,
      `Only HR can browse this Post`,
      "Push Error"
    );

    let { page, limit } = {...req.query};

    if(!currentUser) throw new AppError(400,"User Not Found","Get Post Error");
    
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
        
    const filterConditions = [{isDeleted: false}, {check:false}];

    const filterCriteria = filterConditions.length
    ? { $and: filterConditions}
    : {};
    console.log("filterCriteria un-check",filterCriteria)

    const count = await Post.countDocuments(filterCriteria);
    const totalPage = Math.ceil(count/limit);
    const offset = (page - 1)*limit;


    let posts = await Post.find({isDeleted:false,check:false})
    .sort({createdAt: -1})
    .skip(offset)
    .limit(limit)
    .populate("author");

    console.log("posts", posts)

    sendResponse(res,200,true,{posts,totalPage,count},null,"Filter list of posts success")
});


postController.getCommentsOfPost = catchAsync(async (req, res, next) => {
    const postId= req.params.id;

    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 10;

    const posts = Post.findById(postId);
    if(!posts) throw new AppError(400,"Post Not Found","Get Comment Error");

    const count = await Comment.countDocuments({post:postId});
    const totalPage = Math.ceil(count/limit);
    const offset = (page-1)*limit;

    const comments = await Comment.find({post:postId})
    .sort({ createAt: -1})
    .skip(offset)
    .limit(limit)
    .populate("author");

    return sendResponse(res,200,true,{comments,totalPage,count},null,"Get Comment Successful")
});

module.exports = postController;