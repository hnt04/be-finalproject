const { AppError, catchAsync,sendResponse } = require("../helpers/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const authController = {};

authController.loginWithEmail = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;

    const users = await User.findOne({email}, "+password"); 
    console.log("users",users) 
    if(!users) throw new AppError(400, "Invalid Credentials","Login Error");

    const isMatch = await bcrypt.compare(password, users.password);
    if(!isMatch) throw new AppError(400, "Wrong Password", "Login Error");
    
    const accessToken = await users.generateToken();
    console.log("accessToken",accessToken)

    sendResponse(
        res,
        200,
        true,
        {users, accessToken},
        null,
        "Login Successful!"
    )
});

module.exports = authController;