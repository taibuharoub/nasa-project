const axios = require("axios");

const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

// const launches = new Map();

const launch = {
  flightNumber: 100, //flight_number
  mission: "Kepler Exoplanet X", //name
  rocket: "Explorer IS1", //rocket.name
  launchDate: new Date("December 17, 2030"), //local_date
  target: "Kepler-442 b", //not applicable
  customers: ["NASA", "SpaceX", "JAXA"], //payloads.customers for each payload
  upcoming: true, //upcoming
  success: true, //success
};

saveLaunch(launch);

const SPACE_X_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  console.log("Downloading Launch data...");
  const response = await axios.post(SPACE_X_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => payload["customers"]);
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers: customers,
    };
    console.log(`${launch.flightNumber} - ${launch.mission}`);
  }
}

async function loadLaunchesData() {
  const firstLaunch = await findLauch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    console.log("Launch data already loaded");
  } else {
    await populateLaunches();
  }
}

async function findLauch(filter) {
  return launchesDatabase.findOne(filter);
}

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
  loadLaunchesData,
};
