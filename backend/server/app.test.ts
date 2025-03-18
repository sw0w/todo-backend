import request from "supertest";
import app from "./app";

describe.skip("Todo API", () => {
  it("should return 401", async () => {
    const res = await request(app).get("/todos");
    expect(res.status).toBe(401);
  });

  it("should allow user registration", async () => {
    const res = await request(app)
      .post("/users/register")
      .send({ username: "testuser123", password: "password123" });

    console.log("Response status:", res.status);
    console.log("Response body:", res.body);

    expect(res.status).toBe(201);
  });
});
