import { describe, it, expect, vi } from "vitest";
import { Request, Response } from "express";
import {
  getBooks,
  getBook,
  createBook,
} from "../../src/controllers/book.controller";
import Book from "../../src/models/Book";

// Mock the Book model
vi.mock("../src/models/Book");

describe("Book Controller", () => {
  it("should return all books", async () => {
    // Mock data
    const mockBooks = [
      { id: 1, name: "Book One" },
      { id: 2, name: "Book Two" },
    ];

    // Mock the Book.findAll method
    vi.spyOn(Book, "findAll").mockResolvedValue(mockBooks as any);

    // Mock request and response
    const req = {} as Request;
    const res = {
      json: vi.fn(),
    } as unknown as Response;

    // Call the controller
    await getBooks(req, res);

    // Assertions
    expect(res.json).toHaveBeenCalledWith(mockBooks);
  });

  it("should return a single book by ID", async () => {
    // Mock data
    const mockBook = { id: 1, name: "Book One" };

    // Mock the Book.findByPk method
    vi.spyOn(Book, "findByPk").mockResolvedValue(mockBook as any);

    // Mock request and response
    const req = { params: { id: "1" } } as unknown as Request;
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as unknown as Response;

    // Call the controller
    await getBook(req, res);

    // Assertions
    expect(res.json).toHaveBeenCalledWith(mockBook);
    expect(res.status).not.toHaveBeenCalledWith(404);
  });

  it("should return 404 if book is not found", async () => {
    // Mock the Book.findByPk method
    vi.spyOn(Book, "findByPk").mockResolvedValue(null);

    // Mock request and response
    const req = { params: { id: "99" } } as unknown as Request;
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as unknown as Response;

    // Call the controller
    await getBook(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Book not found" });
  });

  it("should create a new book", async () => {
    // Mock data
    const mockBook = { id: 1, name: "New Book" };

    // Mock the Book.create method
    vi.spyOn(Book, "create").mockResolvedValue(mockBook as any);

    // Mock request and response
    const req = { body: { name: "New Book" } } as unknown as Request;
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as unknown as Response;

    // Call the controller
    await createBook(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockBook);
  });

  it("should handle errors when creating a book", async () => {
    // Mock error
    const errorMessage = "Database error";
    vi.spyOn(Book, "create").mockRejectedValue(new Error(errorMessage));

    // Mock request and response
    const req = { body: { name: "New Book" } } as unknown as Request;
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as unknown as Response;

    // Call the controller
    await createBook(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: `Failed to create book: Error: ${errorMessage}`,
    });
  });
});
