import { Request, Response } from "express";
import { Book } from "../models";
import cache from "../cache";

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books: " + error });
  }
};


export const getBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cacheKey = `book-${id}`;
    const cachedBook = cache.get(cacheKey);
    if (cachedBook) {
      res.json(cachedBook);
      return;
    }
    const book = await Book.findByPk(id);
    if (!book) {
      res.status(404).json({ error: "Book not found" });
    } else {
      cache.set(cacheKey, book);
      res.json(book);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the book: " + error });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const book = await Book.create({ name });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: "Failed to create book: " + error });
  }
};
