import express from "express";
import { getTodos } from "./todo.controller";
import { vi } from "vitest";
import { AuthReq } from "../../middlewares/authmw";
import httpMocks from "node-mocks-http";
import User from "../../models/user";

const app = express();
app.use(express.json());
app.get("/todos", getTodos);

vi.mock("../../models/user", () => ({
  default: {
    findById: vi.fn(),
  },
}));

describe("todo controller tests", () => {
  afterEach(() => vi.resetAllMocks());

  test("getTodos - fetch them successfully", async () => {
    vi.mocked(User.findById).mockResolvedValue({
      userId: "1234",
      todos: ["Test Todo"],
    });
    const req: AuthReq = httpMocks.createRequest({
      user: { userId: "1234", username: "john" },
    });
    const response = httpMocks.createResponse();
    await getTodos(req, response);

    expect(response._getStatusCode()).toBe(200);
    expect(response._getJSONData()).toEqual({ todos: ["Test Todo"] });
  });

  test("getTodos - user not found", async () => {
    vi.mocked(User.findById).mockResolvedValue(null);
    const req: AuthReq = httpMocks.createRequest({
      user: { userId: "1234", username: "john" },
    });
    const response = httpMocks.createResponse();
    await getTodos(req, response);

    expect(response._getStatusCode()).toBe(404);
  });

  test("getTodos - invalid user id", async () => {
    vi.mocked(User.findById).mockImplementation(() => {
      throw new Error("CastError: Cast to ObjectId failed");
    });

    const req: AuthReq = httpMocks.createRequest({
      user: { userId: "1234", username: "john" },
    });
    const response = httpMocks.createResponse();

    await getTodos(req, response);

    expect(response._getStatusCode()).toBe(500);
    expect(response._getJSONData()).toEqual({
      message: "Error fetching todos",
    });
  });

  test("getTodos - user found but has no todos", async () => {
    vi.mocked(User.findById).mockResolvedValue({ userId: "1234" });

    const req: AuthReq = httpMocks.createRequest({
      user: { userId: "1234", username: "john" },
    });
    const response = httpMocks.createResponse();

    await getTodos(req, response);

    expect(response._getStatusCode()).toBe(200);
    expect(response._getJSONData()).toEqual({ todos: undefined });
  });
});
