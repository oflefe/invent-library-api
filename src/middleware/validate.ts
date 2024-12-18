import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string().required(),
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
