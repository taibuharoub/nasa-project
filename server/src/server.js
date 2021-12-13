const http = require("http");
const { mongoConnect } = require("./services/mongo");
const app = require("./app");

const { loadPLanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

// load planets data on server start (before server starts listening)
async function startServer() {
  await mongoConnect();
  await loadPLanetsData();

  server.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
  });
}

startServer();
