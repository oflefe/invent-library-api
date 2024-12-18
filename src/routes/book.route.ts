import { Router } from 'express';
import { getBooks, getBook, createBook } from '../controllers/book.controller';
import { validateBook } from '../middleware/validate';
export const bookRouter = Router();
bookRouter.get('/', getBooks);
bookRouter.get('/:id', getBook);
bookRouter.post('/', validateBook, createBook);
