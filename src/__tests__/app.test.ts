import app from "../app";
import supertest from "supertest";

jest.mock("../middleware/Discord", () => {
  return {
    init: jest.fn()
  };
});

describe("Test basic endpoints", () => {
  // GET / -> 203
  test("GET /", async () => {
    await supertest(app)
      .get("/")
      .expect(203)
      .then((response) => {
        expect(response.text).toBeUndefined;
      });
  });

  // GET /invite -> 200
  test("GET /invite", async () => {
    await supertest(app)
      .get("/invite")
      .expect(200);
  });
});
