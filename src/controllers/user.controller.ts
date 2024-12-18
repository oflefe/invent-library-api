import { Request, Response } from "express";
import User from "../models/User";
import Book from "../models/Book";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users: " + error });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      include: { model: Book, as: "borrowedBooks" },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user: " + error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const user = await User.create({ name });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user: " + error });
  }
};

export const borrowBook = async (req: Request, res: Response) => {
  try {
    const { userId, bookId } = req.params;
    const user = await User.findByPk(userId);
    const book = await Book.findByPk(bookId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    if (book.borrowerId) {
      res.status(400).json({ error: "Book is already borrowed" });
      return;
    }

    book.borrowerId = user.id;
    await book.save();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to borrow book: " + error });
  }
};

export const returnBook = async (req: Request, res: Response) => {
  try {
    const { userId, bookId } = req.params;
    const { score } = req.body;

    const user = await User.findByPk(userId);
    const book = await Book.findByPk(bookId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!book || book.borrowerId !== user.id) {
      res.status(400).json({ error: "Book was not borrowed by this user" });
      return;
    }

    book.borrowerId = null;
    book.score = score || null;
    await book.save();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to return book: " + error });
  }
};
