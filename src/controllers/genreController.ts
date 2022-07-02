import Book from '@/models/book';
import Genre from '@/models/genre';
import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

type Controller = (req: Request, res: Response, next: NextFunction) => void

export const genre_list: Controller = async (req, res, next) => {
  try {
    const list_genres = await Genre
      .find()
      .sort({ name: 'ascending' })

    res.render('genre/genre_list', { title: 'Genre List', genre_list: list_genres })
  } catch (error) {
    next(error)
  }
}

export const genre_detail: Controller = async (req, res, next) => {
  try {
    const genre_id = req.params.id;

    const genre = await Genre.findById(genre_id)
    const genre_books = await Book.find({ genre: genre_id })

    if (!genre) {
      const err = new Error('Genre not found') as any
      err.status = 404
      return next(err)
    }

    res.render('genre/genre_detail', { title: 'Genre Detail', genre, genre_books })
  } catch (error) {
    next(error)
  }
}

export const genre_create_get: Controller = async (req, res) => {
  res.render('genre/genre_form', { title: 'Create Genre' })
}

export const genre_create_post = [
  body('name', 'Genre name required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)

      const genre = new Genre({ name: req.body.name })

      if (!errors.isEmpty())
        return res.render('genre/genre_form', { title: 'Create Genre', genre, errors: errors.array() })

      const genreAlreadyExists = await Genre.findOne({ name: req.body.name }) as { url: string }

      if (genreAlreadyExists)
        return res.redirect(genreAlreadyExists.url)

      await genre.save()

      res.redirect((genre as any).url)


    } catch (error) {
      next(error)
    }
  }
]

export const genre_delete_get: Controller = async (req, res, next) => {
  try {
    const genre = await Genre.findById(req.params.id)

    if (!genre)
      return res.redirect('/catalog/genres')

    const genre_books = await Book.find({ genre: genre._id })

    return res.render('genre/genre_delete', { title: 'Delete Genre', genre, genre_books })

  } catch (error) {
    next(error)
  }
}

export const genre_delete_post: Controller = async (req, res, next) => {
  try {

    const genre = await Genre.findById(req.body.genreid)

    if (!genre)
      return res.redirect('/catalog/genres')

    const genre_books = await Book.find({ genre: genre._id })

    if (genre_books.length > 0)
      return res.render('genre/genre_delete', { title: 'Delete Genre', genre, genre_books })

    await Genre.findByIdAndRemove(genre._id)

    return res.redirect('/catalog/genres')

  } catch (error) {
    next(error)
  }
}

export const genre_update_get: Controller = async (req, res, next) => {
  try {
    const genre = await Genre.findById(req.params.id)

    if (!genre)
      return res.redirect('/catalog/genres')

    return res.render('genre/genre_form', { title: 'Update Genre', genre })
  } catch (error) {
    next(error)
  }

}

export const genre_update_post = [
  body('name', 'Genre name required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)
      const genre = new Genre({ name: req.body.name, _id: req.params.id })

      if (!errors.isEmpty())
        return res.render('genre/genre_form', { title: 'Update Genre', genre, errors: errors.array() })


      const genreAlreadyExists = await Genre.findOne({ name: req.body.name }) as { url: string }

      if (genreAlreadyExists)
        return res.redirect(genreAlreadyExists.url)

      await Genre.findByIdAndUpdate(genre._id, genre)

      res.redirect((genre as any).url)

    } catch (error) {
      next(error)
    }

  }
]