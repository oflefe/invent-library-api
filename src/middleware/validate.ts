import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
});

const bookSchema = Joi.object({
  name: Joi.string().min(3).max(200).required(),
});

const borrowSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  bookId: Joi.number().integer().positive().required(),
});

const returnSchema = Joi.object({
  score: Joi.number().integer().min(1).max(10).optional(),
});

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }
  next();
};

export const validateBook = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = bookSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }
  next();
};

export const validateBorrow = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { userId, bookId } = req.params;
  const { error } = borrowSchema.validate({ userId, bookId });
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }
  next();
};

export const validateReturn = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = returnSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }
  next();
};
