const launches = new Map();

let lastestFlightNumber = 100;

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

launches.set(launch.flightNumber, launch);

function existsLanuchWithId(launchId) {
  return launches.has(launchId);
}

//launches.values() returns an iterator
function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launch) {
  lastestFlightNumber++;
  launches.set(
    lastestFlightNumber,
    Object.assign(launch, {
      success: true,
      customers: ["SpaceX", "NASA"],
      upcoming: true,
      flightNumber: lastestFlightNumber,
    })
  );
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsLanuchWithId,
  abortLaunchById,
};
