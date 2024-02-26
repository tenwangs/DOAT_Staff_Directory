const basicInfoControllers = require("./basicInfoControllers");
const trainingControllers = require("./trainingControllers");

module.exports = {
  ...basicInfoControllers,
  ...trainingControllers,
};
