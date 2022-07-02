import { NextFunction, Request, Response } from 'express';
import Author from '@/models/author';
import Book from '@/models/book';
import { body, validationResult } from 'express-validator';

type Controller = (req: Request, res: Response, next: NextFunction) => void

export const author_list: Controller = async (req, res, next) => {
  try {
    const list_authors = await Author
      .find()
      .sort({ 'family_name': 'ascending' })

    res.render('author/author_list', { title: 'Author List', author_list: list_authors })
  } catch (error) {
    next(error)
  }
}

export const author_detail: Controller = async (req, res, next) => {
  try {
    const id = req.params.id;

    const author = await Author.findById(id)

    if (!author) {
      const error = new Error('Authro not found') as any
      error.status = 404
      return next(error)
    }

    const author_books = await Book
      .find({ author: id }, { title: true, summary: 1 })

    res.render('author/author_detail', { title: 'Author Detail', author, author_books })

  } catch (error) {
    next(error)
  }
}

export const author_create_get: Controller = async (req, res) => {
  res.render('author/author_form', { title: 'Create Author' })
}

export const author_create_post = [
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('family_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Family name must be specified.')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),
  body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body('date_of_death', 'Invalid date of death')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)

      const author = await Author.create({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death
      }) as any

      if (!errors.isEmpty())
        return res.render('author/author_form', { title: 'Create Author', author, errors: errors.array() })

      await author.save()

      res.redirect(author.url)
    } catch (error) {
      next(error)
    }
  }
]

export const author_delete_get: Controller = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id)

    if (!author)
      return res.redirect('/catalog/authors')

    const author_books = await Book.find({ author: author._id })

    res.render('author/author_delete', { title: 'Delete Author', author, author_books })

  } catch (error) {
    next(error)
  }
}

export const author_delete_post: Controller = async (req, res, next) => {
  try {
    const author = await Author.findById(req.body.authorid)

    if (!author)
      return res.redirect('/catalog/authors')

    const author_books = await Book.find({ author: author._id })

    if (author_books.length > 0)
      return res.render('author/author_delete', { title: 'Delete Author', author, author_books })

    await Author.findByIdAndRemove(author._id)

    return res.redirect('/catalog/authors')

  } catch (error) {
    next(error)
  }
}

export const author_update_get: Controller = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id)

    if (!author)
      return res.redirect('/catalog/authors')

    res.render('author/author_form', { title: 'Create Author', author })
  } catch (error) {
    next(error)
  }
}

export const author_update_post = [
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('family_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Family name must be specified.')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),
  body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body('date_of_death', 'Invalid date of death')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)

      const author = await Author.create({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
      }) as any

      if (!errors.isEmpty())
        return res.render('author/author_form', { title: 'Create Author', author, errors: errors.array() })

      await Author.findByIdAndUpdate(author._id, author)

      res.redirect(author.url)
    } catch (error) {
      next(error)
    }
  }
]