const express = require('express');
const router = express.Router();
const {body,param} = require("express-validator");
const validators = require("../middlewares/validators");
const userController = require("../controllers/user.controller");
const authentication = require("../middlewares/authentication");

// CREATE
/**
 * @route POST /users
 * @description Create new user
 * @access login required, private, HR
 */
router.post('/me',authentication.loginRequired,validators.validate([
    body("name","Invalid Name"),
    body("email","Invalid Email")
    .exists()
    .isEmail()
    .normalizeEmail({gmail_remove_dots:false}),
    body("password","Invalid Password").exists().notEmpty(),
    ]),
    userController.createUsers);

// GET ALL USERS
/**
 * @route GET /users
 * @description Get a list of users
 * @access login required
 */
router.get('/', authentication.loginRequired, userController.getUsers);

// GET MY USER
/**
 * @route GET /users/me
 * @description Get my user
 * @access login required
 */
 router.get('/me', authentication.loginRequired, userController.getCurrentUser);

// GET USER ALLOWED
/**
 * @route PUT /users
 * @description update a user
 * @access login required
 */
 router.get('/allowed', authentication.loginRequired, userController.getUsersAllowed);


// GET DEPARTMENT
// /**
//  * @route GET /users/department
//  * @description Get my user
//  * @access login required
//  */
//  router.get('/department', authentication.loginRequired, userController.getDepartment);

// GET SINGLE USER
/**
 * @route GET /users/:id
 * @description Get a user profile
 * @access login required
 */
router.get('/:id', authentication.loginRequired, validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId)
]),userController.getSingleUser);

// UPDATE
/**
 * @route PUT /users
 * @description update a user
 * @access login required
 */
router.put('/:id', authentication.loginRequired, validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId)
]), userController.updateUsers);




module.exports = router;
