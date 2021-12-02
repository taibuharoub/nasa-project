const launches = new Map();

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
module.exports = {
  launches,
};
