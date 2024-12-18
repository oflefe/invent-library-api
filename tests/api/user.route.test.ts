import express from "express";
import { describe, it, expect, vi } from "vitest";
import * as userController from "../../src/controllers/user.controller";
import { userRoutes } from "../../src/routes/user.route";
import request from "supertest";
import { beforeEach } from "node:test";

const app = express();
app.use("/users", userRoutes);

vi.mock("../../src/controllers/user.controller");

describe("User API Routes", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  it("should call getUsers controller for GET /users", async () => {
    (userController.getUsers as vi.Mock).mockImplementationOnce(
      async (_req, res) => {
        res.json([{ name: "Jane Doe" }]);
      }
    );
    const res = await request(app).get("/users");

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual([{ name: "Jane Doe" }]);
  });

  it("should call getUser controller for GET /users/:id", async () => {
    const mockGetUser = (
      userController.getUser as vi.Mock
    ).mockImplementationOnce(async (_req, res) => {
      res.json({ name: "John Doe" });
    });

    const res = await request(app).get("/users/1");
    expect(mockGetUser).toHaveBeenCalled();
    expect(res.body).toStrictEqual({ name: "John Doe" });
  });

  it("should call createUser controller for POST /users", async () => {
    (userController.createUser as vi.Mock).mockImplementation(
      async (req, res) => {
        res.status(201).json({ id: 1, name: "John Doe" });
      }
    );

    const res = await request(app).post("/users").send({ name: "John Doe" });

    expect(res.body).toStrictEqual({ id: 1, name: "John Doe" });
  });

  it("should call borrowBook controller for POST /users/:userId/borrow/:bookId", async () => {
    (userController.borrowBook as vi.Mock).mockImplementation(
      async (req, res) => {
        res.status(204).send();
      }
    );

    const res = await request(app).post("/users/1/borrow/1");

    expect(res.status).toBe(204);
  });

  it("should call returnBook controller for POST /users/:userId/return/:bookId", async () => {
    (userController.returnBook as vi.Mock).mockImplementation(
      async (req, res) => {
        res.status(204).send();
      }
    );

    const res = await request(app).post("/users/1/return/1").send({ score: 5 });

    expect(res.status).toBe(204);
  });
});
