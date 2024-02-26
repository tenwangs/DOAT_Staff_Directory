const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const trainingSchema = new Schema({
  Title: {
    type: String,
    required: true,
  },
  StartDate: {
    type: Date,
    required: true,
  },
  EndDate: {
    type: Date,
    required: true,
  },
  Country: {
    type: String,
    required: true,
  },
  Funding: {
    type: String,
  },
  reportFile: {
    type: String,
  },
  certificate: {
    type: String,
  },
});

const detailSchema = new Schema(
  {
    EmployeeId: {
      type: String,
      required: true,
    },
    Name: {
      type: String,
      required: true,
    },
    Designation: {
      type: String,
      required: true,
    },
    Division: {
      type: String,
      required: true,
    },
    Section: {
      type: String,
      required: true,
    },
    Trainings: {
      type: [trainingSchema],
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Detail", detailSchema);
