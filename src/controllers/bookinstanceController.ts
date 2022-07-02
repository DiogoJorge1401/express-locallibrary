import { NextFunction, Request, Response } from 'express';
import BookInstance from '@/models/bookinstance';
import Book from '../models/book';
import { body, validationResult } from 'express-validator';

type Controller = (req: Request, res: Response, next: NextFunction) => void

export const bookinstance_list: Controller = async (req, res, next) => {
  try {
    const list_bookinstances = await BookInstance
      .find()
      .populate('book')

    res.render('book_instance/bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances })
  } catch (error) {
    next(error)
  }

}

export const bookinstance_detail: Controller = async (req, res, next) => {
  try {
    const id = req.params.id;

    const bookinstance = await BookInstance
      .findById(id)
      .populate('book')

    if (!bookinstance) {
      const error = new Error('Book copy not found') as any
      error.status = 404
      return next(error)
    }

    res.render('book_instance/bookinstance_detail', { title: `Copy ${(bookinstance.book as any).title}`, bookinstance })

  } catch (error) {
    next(error)
  }
}

export const bookinstance_create_get: Controller = async (req, res) => {
  const books = await Book.find()
  res.render('book_instance/bookinstance_form', { title: 'Create BookInstance', book_list: books })
}

export const bookinstance_create_post = [
  body('book', 'Book must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('imprint', 'Imprint must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('status')
    .escape(),
  body('due_back', 'Invalid date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)

      const bookinstance = new BookInstance({
        book: req.body.book,
        imprint: req.body.imprint,
        status: req.body.status,
        due_back: req.body.due_back
      })

      if (!errors.isEmpty()) {
        const books = await Book.find({}, 'title')
        return res.render(
          'book_instance/bookinstance_form',
          {
            title: 'Create BookInstance',
            book_list: books,
            selected_book: (bookinstance.book as any)._id,
            errors: errors.array(),
            bookinstance: bookinstance
          })
      }

      await bookinstance.save()

      res.redirect((bookinstance as any).url)
    } catch (error) {
      next(error)
    }
  }
]

export const bookinstance_delete_get: Controller = async (req, res, next) => {
  try {
    const bookinstance = await BookInstance
      .findById(req.params.id)
      .populate('book')

    if (!bookinstance)
      return res.redirect('/catalog/bookinstances')

    return res.render(
      'book_instance/bookinstance_delete',
      { title: 'Delete BookInstance', bookinstance }
    )
  } catch (error) {
    next(error)
  }
}

export const bookinstance_delete_post: Controller = async (req, res, next) => {
  try {
    const book_instance = await BookInstance.findById(req.body.bookinstanceid)

    if (!book_instance)
      return res.redirect('/catalog/bookinstances')

    await BookInstance.findByIdAndRemove(book_instance._id)

    return res.redirect('/catalog/bookinstances')

  } catch (error) {
    next(error)
  }
}

export const bookinstance_update_get: Controller = async (req, res, next) => {
  try {
    const bookinstance = await BookInstance.findById(req.params.id)

    const books = await Book.find({}, 'title')


    if (!bookinstance)
      return res.redirect('/catalog/bookinstances')

    return res.render(
      'book_instance/bookinstance_form',
      {
        title: 'Create BookInstance',
        book_list: books,
        selected_book: (bookinstance.book as any)._id,
        bookinstance
      })

  } catch (error) {
    next(error)
  }
}

export const bookinstance_update_post = [
  body('book', 'Book must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('imprint', 'Imprint must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('status')
    .escape(),
  body('due_back', 'Invalid date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)

      const bookinstance = new BookInstance({
        book: req.body.book,
        imprint: req.body.imprint,
        status: req.body.status,
        due_back: req.body.due_back,
        _id: req.params.id
      })

      if (!errors.isEmpty()) {
        const books = await Book.find({}, 'title')
        return res.render(
          'book_instance/bookinstance_form',
          {
            title: 'Create BookInstance',
            book_list: books,
            selected_book: (bookinstance.book as any)._id,
            errors: errors.array(),
            bookinstance: bookinstance
          })
      }

      await BookInstance.findByIdAndUpdate(bookinstance._id, bookinstance)

      res.redirect((bookinstance as any).url)
    } catch (error) {
      next(error)
    }
  }
]