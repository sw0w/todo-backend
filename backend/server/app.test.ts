import request from "supertest";
import app from "./app";
import { describe, expect, it } from "vitest";

describe("Todo API", () => {
  it("should return 401", async () => {
    const res = await request(app).get("/todos");
    expect(res.status).toBe(401);
  });
});
