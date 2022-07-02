import { Router } from 'express'
import {
  book_create_get,
  book_create_post,
  book_delete_get,
  book_delete_post,
  book_update_get,
  book_update_post,
  book_detail,
  book_list,
  index
} from '@/controllers/bookController'

const book_routes = Router()

book_routes
  .get('/book/create', book_create_get)
  .post('/book/create', book_create_post)
  .get('/book/:id/delete', book_delete_get)
  .post('/book/:id/delete', book_delete_post)
  .get('/book/:id/update', book_update_get)
  .post('/book/:id/update', book_update_post)
  .get('/book/:id', book_detail)
  .get('/books', book_list)
  .get('/', index)


export { book_routes }