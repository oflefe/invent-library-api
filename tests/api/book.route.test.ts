import express from "express";
import bodyParser from "body-parser";
import request from "supertest";
import { bookRoutes } from "../../src/routes/book.route";
import * as bookController from "../../src/controllers/book.controller";
import * as validate from "../../src/middleware/validate";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/controllers/book.controller");
vi.mock("../../src/middleware/validate");

describe("Book API Routes", () => {
  let app: express.Express;
  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    app.use("/books", bookRoutes);

    vi.restoreAllMocks();
  });

  it("GET /books should call book controller getBooks and return the list", async () => {
    (bookController.getBooks as vi.Mock).mockImplementationOnce((_req, res) =>
      res.status(200).json([{ id: 1, name: "Mock Book" }])
    );
    const res = await request(app).get("/books");
    expect(res.body).toStrictEqual([{ id: 1, name: "Mock Book" }]);
    expect(bookController.getBooks).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  it("GET /books/:id should call book controller getBook and return the book", async () => {
    (bookController.getBook as vi.Mock).mockImplementationOnce((_req, res) =>
      res.status(200).json({ id: 1, name: "Mock Book" })
    );
    const res = await request(app).get("/books/1");
    expect(res.body).toStrictEqual({ id: 1, name: "Mock Book" });
    expect(bookController.getBook).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  it("POST /books should call book controller createBook and return the book", async () => {
    (validate.validateBook as vi.Mock).mockImplementation((_req, _res, next) =>
      next()
    );
    (bookController.createBook as vi.Mock).mockImplementationOnce((_req, res) =>
      res.status(201).json({ id: 1, name: "Mock Book" })
    );
    const res = await request(app).post("/books").send({ name: "Mock Book" });
    expect(res.body).toStrictEqual({ id: 1, name: "Mock Book" });
    expect(bookController.createBook).toHaveBeenCalled();
    expect(res.status).toBe(201);
  });
});