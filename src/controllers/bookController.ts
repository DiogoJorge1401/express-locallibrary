import { NextFunction, Request, Response } from 'express';
import Book from '@/models/book';
import Author from '@/models/author';
import Genre from '@/models/genre';
import BookInstance from '@/models/bookinstance';
import { body, validationResult } from 'express-validator';

type Controller = (req: Request, res: Response, next: NextFunction) => void

export const index: Controller = async (_req, res) => {
  try {
    const data = Object.fromEntries([
      ['book_count', await Book.countDocuments()],
      ['book_instance_count', await BookInstance.countDocuments()],
      ['book_instance_available_count', await BookInstance.count({ status: 'Available' })],
      ['author_count', await Author.countDocuments()],
      ['genre_count', await Genre.countDocuments()],
    ])

    res.render('index', { title: 'Local Library Home', data, error: null })
  } catch (error) {
    res.render('index', { title: 'Local Library Home', data: null, error })
  }
}

export const book_list: Controller = async (_req, res, next) => {
  try {
    const list_books = await Book
      .find({}, { title: true, author: true })
      .sort({ title: 1 })
      .populate('author')

    res.render('book/book_list', { title: 'Book List', book_list: list_books })
  } catch (error) {
    next(error)
  }
}

export const book_detail: Controller = async (req, res, next) => {
  try {
    const id = req.params.id;

    const book = await Book
      .findById(id)
      .populate('author')
      .populate('genre')

    if (!book) {
      const error = new Error('Book not found') as any
      error.status = 404
      return next(error)
    }

    const book_instances = await BookInstance
      .find({ book: id })

    res.render('book/book_detail', { title: book.title, book, book_instances })

  } catch (error) {
    next(error)
  }
}

export const book_create_get: Controller = async (_req, res, next) => {
  try {
    const authors = await Author.find()

    const genres = await Genre.find()

    res.render('book/book_form', { title: 'Create Book', authors, genres })

  } catch (error) {
    next(error)
  }


}

export const book_create_post = [
  (req: Request, res: Response, next: NextFunction) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined')
        req.body.genre = [];
      else
        req.body.genre = new Array(req.body.genre);
    }
    next();
  },
  body('title', 'Title must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('author', 'Author must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('summary', 'Summary must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('isbn', 'ISBN must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('genre.*').escape(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)

      const book = new Book({
        title: req.body.title,
        author: req.body.author,
        summary: req.body.summary,
        isbn: req.body.isbn,
        genre: req.body.genre,
      })

      if (!errors.isEmpty()) {
        const authors = await Author.find()

        const genres = await Genre.find()

        for (let i = 0; i < genres.length; i++) {
          if (book.genre?.includes(genres[i]._id))
            (genres[i] as any).checked = 'true'
        }

        return res.render('book/book_form', { title: 'Create Book', authors, genres, book, errors: errors.array() })
      }

      await book.save()

      res.redirect((book as any).url)

    } catch (error) {
      next(error)
    }

  }
]

export const book_delete_get: Controller = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id)

    if (!book)
      return res.redirect('/catalog/books')

    const book_instances = await BookInstance.find({ book: book._id })

    res.render('book/book_delete', { title: 'Delete Book', book, book_instances })
  } catch (error) {
    next(error)
  }

}

export const book_delete_post: Controller = async (req, res, next) => {
  try {
    const book = await Book.findById(req.body.bookid)

    if (!book)
      return res.redirect('/catalog/books')

    const book_instances = await BookInstance.find({ book: book._id })

    if (book_instances.length > 0)
      res.render('book/book_delete', { title: 'Delete Book', book, book_instances })

    await Book.findByIdAndRemove(book._id)

    return res.redirect('/catalog/books')

  } catch (error) {
    next(error)
  }
}

export const book_update_get: Controller = async (req, res, next) => {
  try {
    const book = await Book
      .findById(req.params.id)
      .populate('genre')
      .populate('author')

    const authors = await Author.find()

    const genres = await Genre.find()

    if (!book) {
      const err = new Error('Boo not found') as any
      err.status = 404
      return next(err)
    }

    const book_genres = book.genre as any[]

    for (let all_g_iter = 0; all_g_iter < genres.length; all_g_iter++)
      for (let book_g_iter = 0; book_g_iter < book_genres.length; book_g_iter++) {
        const genre_id = genres[all_g_iter]._id.toString();

        const book_genre_id = book_genres[book_g_iter]._id.toString();

        if (genre_id === book_genre_id)
          (genres[all_g_iter] as any).checked = 'true'
      }

    res.render(
      'book/book_form',
      { title: 'Update Book', authors, genres, book }
    )

  } catch (error) {

  }
}

export const book_update_post = [
  (req: Request, res: Response, next: NextFunction) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined')
        req.body.genre = [];
      else
        req.body.genre = new Array(req.body.genre);
    }
    next();
  },
  body('title', 'Title must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('author', 'Author must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('summary', 'Summary must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('isbn', 'ISBN must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('genre.*').escape(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)

      const book = new Book({
        title: req.body.title,
        author: req.body.author,
        summary: req.body.summary,
        isbn: req.body.isbn,
        genre: (typeof req.body.genre === 'undefined' ? [] : req.body.genre),
        _id: req.params.id
      })

      if (!errors.isEmpty()) {
        const authors = await Author.find()
        const genres = await Genre.find()

        for (let i = 0; i < genres.length; i++)
          if (book.genre?.includes(genres[i]))
            (genres[i] as any).checked = 'true'

        return res.render(
          'book/book_form', {
          title: 'Update Book',
          authors,
          genres,
          book,
          errors: errors.array()
        })
      }

      await Book.findByIdAndUpdate(book._id, book)

      res.redirect((book as any).url)
    } catch (error) {
      next(error)
    }

  }
]