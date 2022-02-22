const request = require("supertest");

const app = require("../../app");
const { loadPLanetsData } = require("../../models/planets.model");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API", () => {
  // Will add a setup step to connect to the database before the tests
  // our tests are running on the live database
  beforeAll(async () => {
    await mongoConnect();
    await loadPLanetsData();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /v1/launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app).get("/v1/launches");
      // const response = await request(app).get("/launches").expect(200);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Test POST /v1/launches", () => {
    const completeLaunchData = {
      mission: "USS Enterprise",
      rocket: "Falcon 9",
      target: "Kepler-296 f",
      launchDate: "January 4, 2028",
    };
    const launchDataWithDate = {
      mission: "USS Enterprise",
      rocket: "Falcon 9",
      target: "Kepler-296 f",
    };

    const launchDataWithInvalidDate = {
      mission: "USS Enterprise",
      rocket: "Falcon 9",
      target: "Kepler-296 f",
      launchDate: "hello",
    };

    test("It should respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(launchDataWithDate);
    });

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithDate)
        .expect("Content-type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });

    test("It should catch invalid dates ", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
