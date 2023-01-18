var express = require('express');
var router = express.Router();

/* GET home page. */
const authRouter = require('./auth.api');
router.use('/auth',authRouter);

const tasksRouter = require('./task.api.js');
router.use('/tasks', tasksRouter);

const usersRouter = require('./user.api.js');
router.use('/users', usersRouter);

const postsRouter = require('./post.api.js');
router.use('/posts', postsRouter);

const commentsRouter = require('./comment.api.js');
router.use('/comments', commentsRouter);

const reactionsRouter = require('./reaction.api.js');
router.use('/reactions',reactionsRouter);

const commendationsRouter = require('./commendation.api.js');
router.use('/commendations',commendationsRouter);

module.exports = router;
