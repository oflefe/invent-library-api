import express from "express";
import {
  getUsers,
  createUser,
  borrowBook,
  returnBook,
  getUser,
} from "../controllers/user.controller";
import { validateUser } from "../middleware/validate";

const router = express.Router();
router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", validateUser, createUser);
router.post("/:userId/borrow/:bookId", borrowBook);
router.post("/:userId/return/:bookId", returnBook);

export default router;
