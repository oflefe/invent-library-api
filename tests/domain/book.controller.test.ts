import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response } from "express";
import {
  getBooks,
  getBook,
  createBook,
} from "../../src/controllers/book.controller";
import { Book } from "../../src/models/index";

vi.mock("../src/models/Book");
vi.mock("node-cache");

describe("Book Controller", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  it("should return all books", async () => {
    const mockBooks = [
      { id: 1, name: "Book 1" },
      { id: 2, name: "Book 2" },
    ];

    vi.spyOn(Book, "findAll").mockResolvedValueOnce(mockBooks as any);

    const req = {} as Request;
    const res = {
      json: vi.fn(),
      status: vi.fn(),
    } as unknown as Response;

    await getBooks(req, res);

    expect(res.json).toHaveBeenCalledWith(mockBooks);
    expect(res.status).not.toHaveBeenCalledWith(500);
  });
  it("should handle errors in getBooks", async () => {
    const errorMessage = "Database error";
    vi.spyOn(Book, "findAll").mockRejectedValue(new Error(errorMessage));

    const req = {} as Request;
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as unknown as Response;

    await getBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: `Failed to fetch books: Error: ${errorMessage}`,
    });
  });

  it("should return a book by ID from database if cache null", async () => {
    const mockBook = { id: 1, name: "Book 1" };
    vi.spyOn(Book, "findByPk").mockResolvedValueOnce(mockBook as any);
    const req = { params: { id: "1" } } as unknown as Request;
    const res = {
      json: vi.fn(),
      status: vi.fn(),
    } as unknown as Response;

    await getBook(req, res);

    expect(res.json).toHaveBeenCalledWith(mockBook);
    expect(res.status).not.toHaveBeenCalledWith(404);
  });
  it("should handle errors in getBook", async () => {
    const errorMessage = "Database error";
    vi.spyOn(Book, "findByPk").mockRejectedValueOnce(new Error(errorMessage));

    const req = { params: { id: "1" } } as unknown as Request;
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as unknown as Response;

    await getBook(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: `Failed to fetch the book: Error: ${errorMessage}`,
    });
  });
  it("should create a book", async () => {
    const mockBook = { id: 1, name: "Book 1" };

    vi.spyOn(Book, "create").mockResolvedValue(mockBook as any);

    const req = { body: { name: "Book 1" } } as unknown as Request;
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as unknown as Response;

    await createBook(req, res);

    expect(res.json).toHaveBeenCalledWith(mockBook);
    expect(res.status).toHaveBeenCalledWith(201);
  });
  it("should handle errors in createBook", async () => {
    const errorMessage = "Database error";
    vi.spyOn(Book, "create").mockRejectedValue(new Error(errorMessage));

    const req = { body: { name: "Book 1" } } as unknown as Request;
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as unknown as Response;

    await createBook(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: `Failed to create book: Error: ${errorMessage}`,
    });
  });
});
