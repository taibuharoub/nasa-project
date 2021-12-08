const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");

const { loadPLanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;

const MONGO_URI = "";

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("MonogDB connection ready!");
});
mongoose.connection.on("error", (err) => {
  console.error(err);
});

// load planets data on server start (before server starts listening)
async function startServer() {
  await mongoose.connect(MONGO_URI);
  await loadPLanetsData();

  server.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
  });
}

startServer();
