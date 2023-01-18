const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const {body,param} = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require('../middlewares/authentication');


// CREATE
/**
 * @route POST /tasks
 * @description create a task
 * @access login required
 */
router.post('/', authentication.loginRequired, validators.validate([
    body("task_name","Missing Task's Name")
    .exists()
    .notEmpty(),
    body("description","Missing Description")
    .exists()
    .notEmpty(),
    ]), taskController.createTasks);

// GET ALL TASKS
/**
 * @route GET /tasks
 * @description Get a list of tasks
 * @access login required
 */
router.get('/',  authentication.loginRequired, taskController.getTasks);

// GET ALL TASK OF USER
/**
 * @route GET /tasks/me
 * @description Get tasks of user
 * @access Login require
 */
 router.get('/me', authentication.loginRequired, taskController.getPersonalTasks);

// GET SINGLE TASK
/**
 * @route GET /tasks/:id
 * @description Get task by id
 * @access login required
 */
 router.get('/:id', authentication.loginRequired, validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId)
]), taskController.getSingleTask);


// UPDATE
/**
 * @route PUT /tasks
 * @description update a task
 * @access login required
 */
router.put('/:id', authentication.loginRequired, validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId)
]), taskController.editTasks);

// DELETE
/**
 * @route DELETE /tasks
 * @description delete a task
 * @access login required
 */

router.delete('/:id',authentication.loginRequired, validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId)
]), taskController.deleteTasks);



module.exports = router;