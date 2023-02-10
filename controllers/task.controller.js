const mongoose = require('mongoose');
const { sendResponse, AppError, catchAsync} = require("../helpers/utils.js");
const Task = require('../models/Task.js');
const User = require('../models/User.js');

const taskController = {};

const calculateTask = async(userId) => {
    const taskCount = await Task.countDocuments({
        assigner: userId,
        isDeleted: false,
    });
    await User.findByIdAndUpdate(userId, {taskCount});
}

taskController.createTasks = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;

    let {task_name, handler, description, status, deadlineAt} = req.body;
    console.log("req.body",req.body)

    if(!task_name || !description || !handler || !deadlineAt) throw new AppError(402,"Bad Request","Create Task Error");

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
    // handler = await User.findById(handler);
    const roleHandler = handler.map((h) => h.role);

    const allowedAssignerRole = existsRole.filter((el,index) => {
        if(roleCheck) {
            return true
        } if(el === roleAssigner) {
            roleCheck = true;
        } return false
    });
    console.log("roleHandler",roleHandler)
    console.log("allowedAssignerRole",allowedAssignerRole)
    console.log(allowedAssignerRole.includes(roleHandler))

    if(!roleHandler.every((r) => allowedAssignerRole.includes(r)) ) throw new AppError(400,"You Can Not Assign For This Person","Assign Task Error")

    // const userData = await User.findById(handler);
        
    if(!handler) throw new Error(404,"User Not Found","Create Task Error") 

	let tasks = await Task.create({
        task_name,
        handler: handler,
        assigner:currentUserId,
        description,
        status,
        deadlineAt
    });

    await User.findByIdAndUpdate(handler, {$push: {tasks: tasks._id}})
    
    await User.findByIdAndUpdate(assigner, {$push: {tasks: tasks._id}}) 
    
    tasks = await tasks.populate("handler");

	return sendResponse(res,200,true,tasks,null,"Create Task Success")
});

taskController.getTasks = catchAsync(async (req, res, next) => {
    let { page, limit, ...filterQuery } = {...req.query};
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        
    const filterConditions = [{isDeleted: false}];

    if(filterQuery.task_name) {
        filterConditions.push({
            task_name: { $regex: filterQuery.task_name, $options: "i"},
        })
    };
    if(filterQuery.handler) {
        filterConditions.push({
            handler: { $regex: filterQuery.handler, $options: "i"},
        })
    };
    if(filterQuery.assigner) {
        filterConditions.push({
            assigner: { $regex: filterQuery.assigner, $options: "i"},
        })
    };
    if(filterQuery.description) {
        filterConditions.push({
            description: { $regex: filterQuery.description, $options: "i"},
        })
    };

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

    const count = await Task.countDocuments(filterCriteria);
    const totalPage = Math.ceil(count/limit);
    const offset = (page - 1)*limit;

    let tasks = await Task.find(filterCriteria)
    .sort({ createAt: -1})
    .skip(offset)
    .limit(limit);

    sendResponse(res,200,true,{tasks,totalPage,count},null,"Filter list of tasks success")
});

taskController.getPersonalTasks = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    console.log("currentUserId",currentUserId)

    let tasksHandle = await Task.find({handler: currentUserId})
    .sort({ createAt: -1})
    .populate("handler")
    .populate("assigner");

    let tasksAssign = await Task.find({assigner: currentUserId})
    .sort({ createAt: -1})
    .populate("handler");

    // console.log("tasks",tasks)
    // tasks = await tasks.populate("handler")

    sendResponse(res,200,true,{tasksHandle,tasksAssign},null,"Filter list tasks of users success")
});

taskController.getSingleTask = catchAsync(async (req, res, next) => { 
    const currentUserId = req.userId;
    const taskId = req.params.id;

    let tasks = await Task.findById(taskId);

    if(!tasks) throw new AppError(400,"Task Not Found","Get Single Task Error");

    return sendResponse(res,200,true,tasks,null,"Get Task Successful")
 });

//  taskController.getTasksOfId = catchAsync(async (req, res, next) => {
//     const { currentUserId } = req;
  
//     const tasksList = await Task.find({
//       handler: currentUserId,
//     }).populate("handler");
  
//     return sendResponse(
//       res,
//       200,
//       true,
//       { tasksList },
//       null,
//       "Get list of Task Successful"
//     );
//   });

taskController.editTasks = catchAsync(async (req, res, next) => {
    const taskId = req.params.id;
    const currentUserId = req.userId;

    let {task_name, handler, description, status, reviewAt, deadlineAt} = req.body;

    let tasks = await Task.findById(taskId);
    if(!tasks) throw new AppError(400,"Task Not Found","Update Task Error");
    if(!tasks.assigner.equals(currentUserId)) throw new AppError(400,"Only User Can Edit Their Task","Update Task Error");

    const {changingStatus} = req.body;
    let user = await User.findById(currentUserId);
    const handlerStatus = user.role === handler;
    
    if(handlerStatus && !["PENDING", "WORKING", "REVIEW"].includes(changingStatus)) throw new AppError(400,"Only Assigner Can Set This Status","Set Status Error");
    
    if(handlerStatus && ["PENDING", "WORKING", "REVIEW"].includes(changingStatus)){
    await Task.findByIdAndUpdate(taskId, {
        status: changingStatus
    })
    } else {
    await Task.findByIdAndUpdate(taskId, {
        status: changingStatus
    })
}
    const updateTasks = await Task.findByIdAndUpdate(taskId, {
        task_name,
        handler: handler,
        assigner:currentUserId,
        description,
        status,
        reviewAt,
        deadlineAt
    }).lean();

    sendResponse(res,200,true,updateTasks,null,"Update task success")
        
    });


taskController.deleteTasks = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const taskId = req.params.id;

    const tasks = await Task.findOneAndUpdate(
        { _id: taskId, assigner: currentUserId},
        { isDeleted: true },
        {new:true}
    );

    if(!tasks) throw new AppError(400,"Task Not Found/ User Not Authorized","Delete Task Error");
    // await calculatePost(assigner);
    
    return sendResponse(res,200,true,tasks,null,"Delete Task Successful")
});

module.exports = taskController;