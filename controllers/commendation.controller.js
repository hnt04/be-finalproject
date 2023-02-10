const mongoose = require("mongoose");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils.js");
// const Task = require('../models/Task.js');
const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const Task = require("../models/Task.js");
const Commendation = require("../models/Commendation.js");
const dayjs = require("dayjs");

const commendationController = {};

commendationController.createCommendationOfMonth = catchAsync(
  async (req, res, next) => {
    const currentUserId = req.userId;

    let currentUser = await User.findById(currentUserId);
    console.log("currentUser", currentUser);

    const { userId, month, name, year } = req.body;

    if (currentUser.department !== "HR")
      throw new AppError(
        404,
        `Only HR can update Commendation Board`,
        "Push Error"
      );

    // find Commendation of month, check
    let commendations = await Commendation.findOne({
      month,
      year
    });
    // if not exist, create new commendation of month
    if (!commendations) {
      await Commendation.create({
        month,
        year
      });
    }

    commendations = await Commendation.findOneAndUpdate({
      month,year}, {
      month,
      name,
      year
  },{new:true});

  if (commendations.name.includes(userId))
  throw new AppError(404, `User already added`, "Push Error");

    sendResponse(
      res,
      200,
      true,
      {commendations},
      null,
      "Filter list commendation of users success"
    );
  }
);

commendationController.getCommendationOfMonth = catchAsync(
  async (req, res, next) => {
    //get current time
    const now = dayjs();
    //get month and year
    const currentMonth = dayjs().month();

    const month = req.params.month;
    const year = req.params.year

    let { page, limit } = {...req.query};
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const filterConditions = [{isDeleted: false}];

    const filterCriteria = filterConditions.length
    ? { $and: filterConditions}
    : {};
    console.log("filterCriteria",filterCriteria)

    const count = await Commendation.countDocuments(filterCriteria);
    const totalPage = Math.ceil(count/limit);
    const offset = (page - 1)*limit;


    console.log("mth",month)
    const currentComm = await Commendation.findOne({
      month,
      year,
      createAt: {
        $gte: dayjs().startOf("year"),
        $lte: dayjs().endOf("year"),
      },
    });

    const commendations = await Commendation.find(currentComm).sort({ createAt: -1})
    .skip(offset)
    .limit(limit).populate("name");
    console.log("commendations",commendations)

    sendResponse(
      res,
      200,
      true,
      {commendations,totalPage,count},
      null,
      "Filter list commendation of users success"
    );
  }
);

module.exports = commendationController;
