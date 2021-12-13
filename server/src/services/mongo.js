const mongoose = require("mongoose");

const MONGO_URI = "mongodb://localhost:27017/nasa-api";

mongoose.connection.once("open", () => {
  console.log("MonogDB connection ready!");
});
mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URI);
}

module.exports = {
  mongoConnect,
};
