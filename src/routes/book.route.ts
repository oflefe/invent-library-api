import { Router } from "express";
import { getBooks, getBook, createBook } from "../controllers/book.controller";
import { validateBook } from "../middleware/validate";
export const bookRoutes = Router();
bookRoutes.get("/", getBooks);
bookRoutes.get("/:id", getBook);
bookRoutes.post("/", validateBook, createBook);
