import { Router } from 'express'
import {
  author_create_get,
  author_create_post,
  author_delete_get,
  author_delete_post,
  author_update_get,
  author_update_post,
  author_detail,
  author_list,
} from '@/controllers/authorController'


const author_routes = Router()

author_routes
  .get('/author/create', author_create_get)
  .post('/author/create', author_create_post)
  .get('/author/:id/delete', author_delete_get)
  .post('/author/:id/delete', author_delete_post)
  .get('/author/:id/update', author_update_get)
  .post('/author/:id/update', author_update_post)
  .get('/author/:id', author_detail)
  .get('/authors', author_list)


export { author_routes }