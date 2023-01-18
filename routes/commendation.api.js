const express = require('express');
const router = express.Router();
const authentication = require("../middlewares/authentication");
const commendationController = require("../controllers/commendation.controller")

// CREATE COMMENDATION OF MONTH
/**
 * @route POST /commendations
 * @description Create a list of commendation
 * @access login required
 */
router.post('/', authentication.loginRequired, commendationController.createCommendationOfMonth);

// GET COMMENDATION OF MONTH
/**
 * @route GET /commendations
 * @description Get a list of commendation
 * @access login required
 */
 router.get('/:month', authentication.loginRequired, commendationController.getCommendationOfMonth);

module.exports = router;
