import request from "supertest";
import app from "./app";
import { describe, test, expect, beforeAll } from "vitest";
import User from "./models/user";

describe("app tests", () => {
  beforeAll(async () => {
    const existingUser = await User.findOne({ username: "testuser" });
    if (existingUser) {
      await User.deleteOne({ username: "testuser" });
    }
  });

  test("unauthorized route, should return 404", async () => {
    const res = await request(app).get("/todos");
    expect(res.status).toBe(404);
  });

  test("should register a user", async () => {
    const res = await request(app)
      .post("/register")
      .send({ username: "testuser", password: "123456" });
    expect(res.status).toBe(201);
  });
});
