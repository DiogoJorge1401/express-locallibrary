import { Router } from 'express'
import {
  genre_create_get,
  genre_create_post,
  genre_delete_get,
  genre_delete_post,
  genre_update_get,
  genre_update_post,
  genre_detail,
  genre_list,
} from '@/controllers/genreController'

const genre_routes = Router()

genre_routes
  .get('/genre/create', genre_create_get)
  .post('/genre/create', genre_create_post)
  .get('/genre/:id/delete', genre_delete_get)
  .post('/genre/:id/delete', genre_delete_post)
  .get('/genre/:id/update', genre_update_get)
  .post('/genre/:id/update', genre_update_post)
  .get('/genre/:id', genre_detail)
  .get('/genres', genre_list)


export { genre_routes }