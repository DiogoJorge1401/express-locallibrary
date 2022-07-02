import { Router } from 'express'
import { author_routes } from './author_routes'
import { bookinstance_routes } from './bookinstance_routes'
import { book_routes } from './book_routes'
import { genre_routes } from './genre_routes'

const catalog_routes = Router()

catalog_routes
  .use(book_routes)
  .use(author_routes)
  .use(genre_routes)
  .use(bookinstance_routes)

export { catalog_routes }
