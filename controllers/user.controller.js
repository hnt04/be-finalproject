const mongoose = require('mongoose');
const { sendResponse, AppError, catchAsync} = require("../helpers/utils.js");
// const Task = require('../models/Task.js');
const User = require('../models/User.js');
const bcrypt = require("bcryptjs");
const Task = require('../models/Task.js');
const userController = {};

userController.createUsers = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    console.log("currentUserId",currentUserId)

    let {employeeId, name, email, password, department, role} = req.body;

    let currentUser = await User.findById(currentUserId);
    console.log("currentUser",currentUser)

    // currentUser = await User.findOne({department});

    if(currentUser.department !== "HR") throw new AppError(404,`Only HR can register new account`,"Register Error");

    // let {employeeId, name, email, password, department, role} = req.body;

    if(!employeeId || !name || !email || !password) throw new AppError(400,"Missing Information","Create User Error");

    let users = await User.findOne({email});

    if(users) throw new AppError(400, "User already exist","Register Error");

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    users = await User.create({
        employeeId,
        name,
        email,
        password,
        department,
        role
    });

    const accessToken = await users.generateToken()

    sendResponse(
        res,
        200,
        true,
        {users, accessToken},
        null,
        "Create User Successful!"
    )
});

userController.getUsers = catchAsync(async (req, res, next) => {
    // const currentUserId = req.userId;
    // const allowedFilter = ["employeeId", "name", "email", "department", "role"];
    let { page, limit, ...filterQuery } = {...req.query};
    console.log("filterQuery",filterQuery)
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        
    const filterConditions = [{isDeleted: false}];
    // const filterKeys = Object.keys(filterQuery);

    if(filterQuery.name) {
        filterConditions.push({
            name: { $regex: filterQuery.name, $options: "i"},
        })
    };
    if(filterQuery.employeeId) {
        filterConditions.push({
            employeeId: { $regex: filterQuery.employeeId, $options: "i"},
        })
    }

    // filterKeys.forEach((key) => {
    //     if (!allowedFilter.includes(key)) {
    //       const exception = new AppError(`Query ${key} is not allowed`);
    //       exception.statusCode = 401;
    //       throw exception;
    //     }
    //     if (!filterQuery[key]) delete filterQuery[key];
    //   });

    const filterCriteria = filterConditions.length
    ? { $and: filterConditions}
    : {};
    console.log("filterCriteria",filterCriteria)

    const count = await User.countDocuments(filterCriteria);
    const totalPage = Math.ceil(count/limit);
    const offset = (page - 1)*limit;

    let users = await User.find(filterCriteria)
    .sort({ createdAt: -1})
    .skip(offset)
    .limit(limit);
    console.log("users",users)

    sendResponse(res,200,true,{users,totalPage,count},null,"Filter list of users success")
});

userController.getCurrentUser = catchAsync(async(req,res,next) => {
    const currentUserId = req.userId;
    console.log("currentUserId",currentUserId)

    const users = await User.findOne({_id: currentUserId}).lean();
    console.log("users",users)
    if(!users) throw new AppError(400, "User Not Found", "Get Current User Error")

    return sendResponse(res,200,true,users,null,"Get Current User Success!")
});

userController.getSingleUser= catchAsync(async (req, res, next) => { 
    const userId = req.params.id;
    
    const users = await User.findById(userId).lean();

	if(!users) throw new AppError(400,"User Not Found","Get Single User Error");

    return sendResponse(res,200,true,users,null,"Get Single User Success");
});

userController.updateUsers = catchAsync(async (req, res, next) => {
    const userId = req.params.id;
    const currentUserId = req.userId;

    if(currentUserId !== userId) throw new AppError(400,"Only User Can Edit Their Profile!","Update User Error");

    let users = await User.findById(userId);
    if(!users) throw new AppError(400,"User Not Found","Update User Error");

    let password = req.body.password;
    if(password) {
    console.log("password", password)

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    users.password = password;
}
     
    const allowed = ["name","email","password","avatarUrl","department","role","phone"];
    allowed.forEach((field) => {
        if(req.body[field] !== undefined) {
            users[field] = req.body[field];
        }
    });

    await users.save();

    return sendResponse(res,200,true,users,null,"Update User Successful!")
});


userController.getUsersAllowed = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;

    const existsRole=[
        "General Manager",
        "Manager",
        "Supervisor",
        "Senior Officer",
        "Officer",
        "Junior Officer",
        "Intern",
        ];


    let roleCheck = false;

    const assigner = await User.findById(currentUserId);
    const roleAssigner = assigner.role;
    let users;

    if(roleAssigner === "General Manager") {
        users = await User.find()
        return sendResponse(res,200,true,{users},null,"Get User Successful!")
    }

    const allowedAssignerRole = existsRole.filter((el,index) => {
        if(roleCheck) {
            return true
        } if(el === roleAssigner) {
            roleCheck = true;
        } return false
    });

    users = await User.find({
        department: assigner.department,
        role: { $in: allowedAssignerRole }
    })

    return sendResponse(res,200,true,{users},null,"Get User Successful!")

});

module.exports = userController;