import { Request, Response } from "express";
import { Op } from "sequelize";
import { User, BorrowRecord, Book } from "../models";
import cache from "../cache";

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
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: BorrowRecord,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: Book,
              attributes: {
                exclude: ["createdAt", "updatedAt", "borrowedById"],
              },
            },
          ],
        },
      ],
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

    if (book.borrowedById) {
      res.status(400).json({ error: "Book is already borrowed" });
      return;
    }

    book.borrowedById = user.id;
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

    if (!book || book.borrowedById !== user.id) {
      res.status(400).json({ error: "Book was not borrowed by this user" });
      return;
    }

    const record = await BorrowRecord.findOne({
      where: { userId: user.id, bookId: book.id },
    });

    if (record) {
      record.score = score;
      record.returnedAt = new Date();
      await record.save();
    } else {
      await BorrowRecord.create({
        userId: user.id,
        bookId: book.id,
        score: req.body.score,
        returnedAt: new Date(),
      });
    }
    const allRatings = await BorrowRecord.findAll({
      where: {
        bookId: book.id,
        score: { [Op.ne]: null },
      },
      attributes: ["score"],
    });
    const total = allRatings.reduce((sum, r) => sum + (r.score ?? 0), 0);
    const avg = allRatings.length > 0 ? total / allRatings.length : null;
    book.averageRating = avg;
    book.borrowedById = null;
    cache.set(`book-${book.id}`, book);
    await book.save();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to return book: " + error });
  }
};
