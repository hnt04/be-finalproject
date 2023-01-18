const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema(
  {
    task_name: {
      type: String,
      required: true,
    },
    handler: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
    assigner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "WORKING", "REVIEW", "DONE", "ARCHIVE"],
      required: true,
      default: "PENDING",
    },
    reviewAt: {
      type: Date,
      require: true,
      default: Date,
    },
    deadlineAt: {
      type: Date,
      require: true,
    },
    taskCount: { 
      type: Number, 
      default:0 },
    isDeleted: {
      type: Boolean,
      default:false,
      select: false
  },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
