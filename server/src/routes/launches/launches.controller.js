const { launches } = require("../../models/launches.model");

function getAllLaunches(req, res) {
  return res.status(200).json(Array.from(launches.values())); //launches.values() returns an iterator
}

module.exports = {
  getAllLaunches,
};
