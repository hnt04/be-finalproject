const express = require('express');
const router = express.Router();
const {body,param} = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require('../middlewares/authentication');
const postController = require('../controllers/post.controller');

// CREATE
/**
 * @route POST /posts
 * @description Create a new post
 * @access Login require
 */
router.post('/', authentication.loginRequired,validators.validate([
    body("content","Missing Content")
    .exists()
    .notEmpty()
    ]),postController.createPosts);

 // GET ALL POST 
 /**
  * @route GET /posts/user/:userId
  * @description Get a list of posts
  * @access Login require
 */
router.get('/user/:userId', authentication.loginRequired, validators.validate([
   param("userId").exists().isString().custom(validators.checkObjectId)
]), postController.getPosts);

 // GET ALL POST UNCHECK
 /**
  * @route GET /posts/uncheck/:userId
  * @description Get a list of posts
  * @access Login require
 */
  router.get('/uncheck', authentication.loginRequired, postController.getUnCheckPosts);

// GET SINGLE POST
/**
 * @route GET /posts/:id
 * @description Get post by id
 * @access Login require
 */
router.get('/:id', authentication.loginRequired, validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId)
]), postController.getSinglePost);

// UPDATE
/**
 * @route PUT /posts/:id
 * @description update a post
 * @access Login require
 */
router.put('/:id', authentication.loginRequired, validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId)
]), postController.updatePosts);

// UPDATE CHECK
/**
 * @route PUT /posts/uncheck/:id
 * @description browse a post
 * @access Login require
 */
 router.put('/uncheck/:id', authentication.loginRequired, validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId)
]), postController.updateCheckPosts);


// DELETE
/**
 * @route DELETE /posts
 * @description delete a post
 * @access Login require
 */
router.delete('/:id', authentication.loginRequired, validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId)
]), postController.deletePosts);

// DELETE UNCHECK
/**
 * @route DELETE /posts/uncheck
 * @description delete a post
 * @access Login require
 */
router.delete('/uncheck/:id', authentication.loginRequired, validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId)
]), postController.deleteUnCheckPosts);

// GET ALL POST OF USER
/**
 * @route GET /users/:userId/posts
 * @description Get a list of posts
 * @access Login require
 */
 router.get('/users/:userId', authentication.loginRequired, validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId)
]), postController.getPosts);


// GET ALL COMMENTS IN POST
/**
 * @route GET /posts/:id/comments
 * @description Get a list of comments in post
 * @access Login require
 */
 router.get('/:id/comments', authentication.loginRequired, validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId)
]), postController.getCommentsOfPost);

module.exports = router;
