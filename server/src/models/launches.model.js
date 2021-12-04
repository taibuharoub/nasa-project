const launches = new Map();

let lastestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exoplanet X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 17, 2030"),
  destination: "Kepler-442 b",
  customer: ["NASA", "SpaceX", "JAXA"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

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
      customer: ["SpaceX", "NASA"],
      upcoming: true,
      flightNumber: lastestFlightNumber,
    })
  );
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
};
