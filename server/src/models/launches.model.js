const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

// const launches = new Map();

const launch = {
  flightNumber: 100,
  mission: "Kepler Exoplanet X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 17, 2030"),
  target: "Kepler-442 b",
  customers: ["NASA", "SpaceX", "JAXA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

async function existsLanuchWithId(launchId) {
  return await launchesDatabase.findOne({ flightNumber: launchId });
}

// Auto increment in mongodb
async function getlastestFlightNumber() {
  // finding a launch with the highest flight number
  const lastestLaunch = await launchesDatabase.findOne().sort("-flightNumber");

  if (!lastestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return lastestLaunch.flightNumber;
}

async function getAllLaunches() {
  return launchesDatabase.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({ kepler_name: launch.target });
  if (!planet) {
    throw new Error("No matching Planet not found");
  }
  await launchesDatabase.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getlastestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    customers: ["SpaceX", "NASA"],
    upcoming: true,
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne(
    { flightNumber: launchId },
    { upcoming: false, success: false }
  );

  return aborted.modifiedCount === 1;
}

module.exports = {
  getAllLaunches,
  existsLanuchWithId,
  abortLaunchById,
  scheduleNewLaunch,
};
