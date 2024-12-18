import { Router } from "express";
import {
  getUsers,
  getUser,
  createUser,
  borrowBook,
  returnBook,
} from "../controllers/user.controller";
import {
  validateUser,
  validateBorrow,
  validateReturn,
} from "../middleware/validate";
export const userRoutes = Router();
userRoutes.get("/", getUsers);
userRoutes.get("/:id", getUser);
userRoutes.post("/", validateUser, createUser);
userRoutes.post("/:userId/borrow/:bookId", validateBorrow, borrowBook);
userRoutes.post("/:userId/return/:bookId", validateReturn, returnBook);
