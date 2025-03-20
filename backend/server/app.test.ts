import request from "supertest";
import app from "./app";
import { describe, test, expect } from "vitest";

describe("app tests", () => {
  test("unauthorized route, should return 404", async () => {
    const res = await request(app).get("/todos");
    expect(res.status).toBe(404);
  });

  test("should register a user", async () => {
    const res = await request(app)
      .post("/register")
      .send({ username: "3243322323", password: "123456" });
    expect(res.status).toBe(201);
  });
});
