const express = require('express');
const router = express.Router();
const {body} = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require('../middlewares/authentication');
const reactionController = require('../controllers/reaction.controller');

// CREATE
/**
 * @route POST /reactions
 * @description save reaction to post or comment
 * @access Login require
 */
router.post('/', authentication.loginRequired,validators.validate([
    body("targetType","Invalid targetType")
    .exists()
    .isIn(["Post","Comment"]),
    body("targetId","Invalid targetId")
    .exists()
    .custom(validators.checkObjectId),
    body("emoji","Invalid Emoji")
    .exists()
    .isIn(["heart"]),
    ]),reactionController.saveReactions);

module.exports = router;