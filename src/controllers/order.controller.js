const genericCrud = require("./generic.controller");
const { Order } = require("../model");

module.exports = {
  ...genericCrud(Order),
};
