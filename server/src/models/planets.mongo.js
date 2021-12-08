const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const planetsSchema = new Schema({
  kepler_name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Planet", planetsSchema);
