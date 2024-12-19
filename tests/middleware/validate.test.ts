import { Request, Response, NextFunction } from "express";
import {
  validateUser,
  validateBook,
  validateBorrow,
  validateReturn,
} from "../../src/middleware/validate";
import Joi from "joi";
import { vi, describe, beforeEach, it, expect } from "vitest";

describe("Validation Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
  });

  describe("validateUser", () => {
    it("should call next if validation passes", () => {
      req.body = { name: "John Doe" };
      validateUser(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 400 if validation fails", () => {
      req.body = { name: "JD" };
      validateUser(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: '"name" length must be at least 3 characters long',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("validateBook", () => {
    it("should call next if validation passes", () => {
      req.body = { name: "Mock Book" };
      validateBook(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 400 if validation fails", () => {
      req.body = { name: "MB" };
      validateBook(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: '"name" length must be at least 3 characters long',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("validateBorrow", () => {
    it("should call next if validation passes", () => {
      req.params = { userId: "1", bookId: "1" };
      validateBorrow(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 400 if validation fails", () => {
      const errorMessage = '"userId" must be a positive number';
      req.params = { userId: "-1", bookId: "1" };
      validateBorrow(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("validateReturn", () => {
    it("should call next if validation passes", () => {
      req.body = { score: 5 };
      validateReturn(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 400 if validation fails", () => {
      const errorMessage = '"score" must be less than or equal to 10';
      req.body = { score: 11 };
      validateReturn(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
