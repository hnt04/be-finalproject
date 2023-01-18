const express = require("express");
const validators = require("../middlewares/validators");
const router = express.Router();
const { body } = require("express-validator");
const {loginWithEmail} = require("../controllers/auth.controller");

/**
 * @route POST /auth/login
 * @description Log in with Email & Password
 * @body {email, password}
 * @access public
 */
router.post(
    "/login",
    validators.validate([
    body("email","Invalid Email")
    .exists()
    .isEmail()
    .normalizeEmail({gmail_remove_dots:false}),
    body("password","Invalid Password").exists().notEmpty(),
    ]),
    loginWithEmail
    );

module.exports = router