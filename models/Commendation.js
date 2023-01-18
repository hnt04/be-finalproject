const mongoose = require("mongoose");
const commendationSchema = new mongoose.Schema(
  {
    name: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
    month: {
        type: String,
            enum: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
            ],
            required: true,
      },
  },
  {
    timestamps: true,
  }
);

const Commendation = mongoose.model("Commendation", commendationSchema);

module.exports = Commendation;
