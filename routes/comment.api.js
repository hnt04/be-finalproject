const express = require('express');
const commentController = require("../controllers/comment.controller");
const {body,param} = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require('../middlewares/authentication');
const router = express.Router();

// CREATE
/**
 * @route POST /comments
 * @description Create new comment
 * @body {content,postId}
 * @access Login required
 */
router.post('/', authentication.loginRequired,validators.validate([
    body("content","Missing Content")
    .exists()
    .notEmpty(),
    body("postId","Missing postId")
    .exists()
    .isString()
    .custom(validators.checkObjectId),
    ]),commentController.createComments);

// // GET ALL POST
// /**
//  * @route GET /comments
//  * @description Get a list of comments
//  * @access public
//  */
// router.get('/', commentController.getComments);

// GET SINGLE POST
/**
 * @route GET /comments/:id
 * @description Get comment by id
 * @access public
 */
router.get('/:id', authentication.loginRequired,validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("content","Missing Content")
    .exists()
    .notEmpty(),
    ]), commentController.getSingleComment);

// UPDATE
/**
 * @route PUT /comments/:id
 * @description update a comment
 * @access public
 */
router.put('/:id', authentication.loginRequired,validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("content","Missing Content")
    .exists()
    .notEmpty(),
    ]), commentController.editComments);

// DELETE 
/**
 * @route DELETE /comments
 * @description delete a comment
 * @access public
 */
router.delete('/:id', authentication.loginRequired,validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
]), commentController.deleteComments);

module.exports = router;
