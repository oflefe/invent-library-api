import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express, { Router } from "express";
import bodyParser from "body-parser";
import { userRoutes } from "../../src/routes/user.route";
import * as userController from "../../src/controllers/user.controller";
import * as validate from "../../src/middleware/validate";

vi.mock("../../src/controllers/user.controller");

vi.mock("../../src/middleware/validate");



describe("User API Routes", () => {
  let app: express.Express;
  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    app.use("/users", userRoutes);

    vi.restoreAllMocks();
  });

  it("GET /users should call user controller getUsers and return the list", async () => {
    (userController.getUsers as vi.Mock).mockImplementationOnce((_req, res) =>
      res.status(200).json([{ id: 1, name: "Mock Name" }])
    );
    const res = await request(app).get("/users");
    expect(res.body).toStrictEqual([{ id: 1, name: "Mock Name" }]);
    expect(userController.getUsers).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  it("GET /users/:id should call user controller getUser and return the user", async () => {
    (userController.getUser as vi.Mock).mockImplementationOnce((_req, res) =>
      res.status(200).json({ id: 1, name: "Mock Name" })
    );
    const res = await request(app).get("/users/1");
    expect(res.body).toStrictEqual({ id: 1, name: "Mock Name" });
    expect(userController.getUser).toHaveBeenCalled();
    expect(res.status).toBe(200);
  })

  it("POST /users should call user controller createUser and return the user", async () => {
    (validate.validateUser as vi.Mock).mockImplementation((_req, _res, next) =>
      next()
    );
    (userController.createUser as vi.Mock).mockImplementationOnce((_req, res) =>
      res.status(201).json({ id: 1, name: "Mock Name" })
    );
    const res = await request(app).post("/users").send({ name: "Mock Name" });
    expect(res.body).toStrictEqual({ id: 1, name: "Mock Name" });
    expect(userController.createUser).toHaveBeenCalled();
    expect(res.status).toBe(201);
  });
});
