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
      year,
    });
    // if not exist, create new commendation of month
    if (!commendations) {
      await Commendation.create({
        month,
        year,
      });
    }

    commendations = await Commendation.findOneAndUpdate(
      {
        month,
        year,
      },
      {
        month,
        name,
        year,
      },
      { new: true }
    );

    if (commendations.name.includes(userId))
      throw new AppError(404, `User already added`, "Push Error");

    sendResponse(
      res,
      200,
      true,
      { commendations },
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
    const year = req.params.year;

    let { page, limit } = { ...req.query };
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const filterConditions = [{ isDeleted: false }];

    const filterCriteria = filterConditions.length
      ? { $and: filterConditions }
      : {};
    console.log("filterCriteria", filterCriteria);

    const count = await Commendation.countDocuments(filterCriteria);
    const totalPage = Math.ceil(count / limit);
    const offset = (page - 1) * limit;

    console.log("mth", month);
    // const currentComm = await Commendation.findOne({
    //   month,
    //   year,
    //   createdAt: {
    //     $gte: dayjs().startOf("year"),
    //     $lte: dayjs().endOf("year"),
    //   },
    // });

    let commendations = await Commendation.find()
      .skip(offset)
      .limit(limit)
      .populate("name")
      .lean();
    console.log("commendations", commendations);

    commendations = commendations.map((c) => {
      let monthByNumber = 1;
      switch (c.month) {
        case "January":
          monthByNumber = 1;
          break;
        case "February":
          monthByNumber = 2;
          break;
        case "March":
          monthByNumber = 3;
          break;
        case "April":
          monthByNumber = 4;
          break;
        case "May":
          monthByNumber = 5;
          break;
        case "June":
          monthByNumber = 6;
          break;
        case "July":
          monthByNumber = 7;
          break;
        case "August":
          monthByNumber = 8;
          break;
        case "September":
          monthByNumber = 9;
          break;
        case "October":
          monthByNumber = 10;
          break;
        case "November":
          monthByNumber = 11;
          break;
        case "December":
          monthByNumber = 12;
          break;
        default:
          break;
      }
      return {...c,monthByNumber}
    }).sort((a,b) => {
      let yearDiff = parseInt(a.year) - parseInt(b.year)

      if(yearDiff !== 0 ) {
        return yearDiff
      }
      return a.monthByNumber - b.monthByNumber
    });

    sendResponse(
      res,
      200,
      true,
      { commendations, totalPage, count },
      null,
      "Filter list commendation of users success"
    );
  }
);

module.exports = commendationController;
