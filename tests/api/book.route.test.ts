import express from "express";
import { describe, it, expect, vi } from "vitest";
import * as bookController from "../../src/controllers/book.controller";
import bookRoutes from "../../src/routes/book.route";
import request from "supertest";
import { beforeEach } from "node:test";

const app = express();
app.use("/books", bookRoutes);

vi.mock("../../src/controllers/book.controller");

describe("Book API Routes", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("Should call book controller getBooks and return the list", async () => {
    (bookController.getBooks as vi.Mock).mockImplementationOnce(
      async (_req, res) => {
        res.json([{ id: 1, name: "Mock Name" }]);
      }
    );

    const res = await request(app).get("/books");

    expect(res.body).toStrictEqual([{ id: 1, name: "Mock Name" }]);
  });

  it("Should call book controller getBook and return the book", async () => {
    (bookController.getBook as vi.Mock).mockImplementationOnce(
      async (_req, res) => {
        res.json({ id: 1, name: "Mock Name" });
      }
    );

    const res = await request(app).get("/books/1");

    expect(res.body).toStrictEqual({ id: 1, name: "Mock Name" });
  });

  it("Should call book controller createBook", async () => {
    (bookController.createBook as vi.Mock).mockImplementationOnce(
      async (_req, res) => {
        res.status(201).json({ id: 1, name: "Mock Name" });
      }
    );

    const res = await request(app).post("/books");

    expect(res.body).toStrictEqual({ id: 1, name: "Mock Name" });
  });
});
