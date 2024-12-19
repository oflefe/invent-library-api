import { describe, it, expect, vi } from "vitest";
import { Request, Response } from "express";
import {
  getUsers,
  getUser,
  createUser,
  borrowBook,
  returnBook,
} from "../../src/controllers/user.controller";
import { User, Book, BorrowRecord } from "../../src/models/index";
import { beforeEach } from "node:test";

// Mock the User and Book models
vi.mock("../src/models/User");
vi.mock("../src/models/Book");

describe("User Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should return all users", async () => {
    const mockUsers = [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Doe" },
    ];

    vi.spyOn(User, "findAll").mockResolvedValue(mockUsers as any);

    const req = {} as Request;
    const res = {
      json: vi.fn(),
      status: vi.fn(),
    } as unknown as Response;

    await getUsers(req, res);

    expect(res.json).toHaveBeenCalledWith(mockUsers);
    expect(res.status).not.toHaveBeenCalledWith(500);
  });

  it("should handle errors in getUsers", async () => {
    const errorMessage = "Database error";
    vi.spyOn(User, "findAll").mockRejectedValue(new Error(errorMessage));

    const req = {} as Request;
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as unknown as Response;

    await getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: `Failed to fetch users: Error: ${errorMessage}`,
    });
  });

  it("should return a user by ID", async () => {
    const mockUser = { id: 1, name: "John Doe", borrowedBooks: [] };

    vi.spyOn(User, "findByPk").mockResolvedValue(mockUser as any);

    const req = { params: { id: "1" } } as unknown as Request;
    const res = {
      json: vi.fn(),
      status: vi.fn(),
    } as unknown as Response;

    await getUser(req, res);

    expect(res.json).toHaveBeenCalledWith(mockUser);
    expect(res.status).not.toHaveBeenCalledWith(404);
  });

  it("should handle user not found in getUser", async () => {
    vi.spyOn(User, "findByPk").mockResolvedValue(null);

    const req = { params: { id: "99" } } as unknown as Request;
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as unknown as Response;

    await getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });

  it("should handle errors in getUser", async () => {
    const errorMessage = "Database error";
    vi.spyOn(User, "findByPk").mockRejectedValue(new Error(errorMessage));

    const req = { params: { id: "1" } } as unknown as Request;
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as unknown as Response;

    await getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: `Failed to fetch user: Error: ${errorMessage}`,
    });
  });

  it("should create a new user", async () => {
    const mockUser = { id: 1, name: "John Doe" };

    vi.spyOn(User, "create").mockResolvedValue(mockUser as any);

    const req = { body: { name: "John Doe" } } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  it("should handle errors in createUser", async () => {
    const errorMessage = "Database error";
    vi.spyOn(User, "create").mockRejectedValue(new Error(errorMessage));

    const req = { body: { name: "John Doe" } } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: `Failed to create user: Error: ${errorMessage}`,
    });
  });

  it("should borrow a book successfully", async () => {
    const mockUser = { id: 1, name: "John Doe" };
    const mockBook = {
      id: 1,
      name: "Book One",
      borrowerId: null,
      save: vi.fn(),
    };

    vi.spyOn(User, "findByPk").mockResolvedValue(mockUser as any);
    vi.spyOn(Book, "findByPk").mockResolvedValue(mockBook as any);

    const req = { params: { userId: "1", bookId: "1" } } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
      json: vi.fn(),
    } as unknown as Response;

    await borrowBook(req, res);

    expect(mockBook.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("should handle user not found when borrowing a book", async () => {
    vi.spyOn(User, "findByPk").mockResolvedValue(null);

    const req = { params: { userId: "99", bookId: "1" } } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await borrowBook(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });

  it("should handle book not found when borrowing a book", async () => {
    vi.spyOn(User, "findByPk").mockResolvedValue({ id: 1, name: "John Doe" });
    vi.spyOn(Book, "findByPk").mockResolvedValue(null);

    const req = { params: { userId: "1", bookId: "99" } } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await borrowBook(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Book not found" });
  });

  it("should handle book already borrowed when borrowing a book", async () => {
    const mockUser = { id: 1, name: "John Doe" };
    const mockBook = {
      id: 1,
      name: "Book One",
      borrowedById: 2,
    };

    vi.spyOn(User, "findByPk").mockResolvedValue(mockUser as any);
    vi.spyOn(Book, "findByPk").mockResolvedValue(mockBook as any);

    const req = { params: { userId: "1", bookId: "1" } } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await borrowBook(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Book is already borrowed",
    });
  });

  it("should handle errors when borrowing a book", async () => {
    const errorMessage = "Database error";
    vi.spyOn(Book, "findByPk").mockRejectedValue(new Error(errorMessage));

    const req = { params: { userId: "1", bookId: "1" } } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await borrowBook(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: `Failed to borrow book: Error: ${errorMessage}`,
    });
  });

  it("should return a book successfully", async () => {
    const mockUser = { id: 1, name: "John Doe" };
    const mockBook = {
      id: 1,
      name: "Book One",
      borrowedById: 1,
      save: vi.fn(),
    };
    const mosckBorrowRecord = {
      id: 1,
      userId: 1,
      bookId: 1,
      score: 5,
      returnDate: new Date(),
      save: vi.fn(),
    };

    vi.spyOn(User, "findByPk").mockResolvedValue(mockUser as any);
    vi.spyOn(Book, "findByPk").mockResolvedValue(mockBook as any);
    vi.spyOn(BorrowRecord, "findOne").mockResolvedValue(
      mosckBorrowRecord as any
    );
    vi.spyOn(BorrowRecord, "findAll").mockResolvedValue([{}] as any);
    mosckBorrowRecord.save.mockResolvedValue(mosckBorrowRecord as any);
    const req = {
      params: { userId: "1", bookId: "1" },
      body: { score: 5 },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
      json: vi.fn(),
    } as unknown as Response;

    await returnBook(req, res);

    expect(mockBook.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("should handle user not found when returning a book", async () => {
    vi.spyOn(User, "findByPk").mockResolvedValue(null);

    const req = {
      params: { userId: "99", bookId: "1" },
      body: { score: 5 },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await returnBook(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });

  it("should handle book not borrowed by this user when returning a book", async () => {
    vi.spyOn(User, "findByPk").mockResolvedValue({
      id: 1,
      name: "John Doe",
    } as any);
    vi.spyOn(Book, "findByPk").mockResolvedValue(null);

    const req = {
      params: { userId: "1", bookId: "99" },
      body: { score: 5 },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await returnBook(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Book was not borrowed by this user",
    });
  });

  it("should handle errors when returning a book", async () => {
    const errorMessage = "Database error";
    vi.spyOn(Book, "findByPk").mockRejectedValue(new Error(errorMessage));

    const req = {
      params: { userId: "1", bookId: "1" },
      body: { score: 5 },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await returnBook(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: `Failed to return book: Error: ${errorMessage}`,
    });
  });
});
