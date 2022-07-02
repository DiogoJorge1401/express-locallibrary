import { Router } from 'express'
import {
  bookinstance_create_get,
  bookinstance_create_post,
  bookinstance_delete_get,
  bookinstance_delete_post,
  bookinstance_update_get,
  bookinstance_update_post,
  bookinstance_detail,
  bookinstance_list,
} from '@/controllers/bookinstanceController'


const bookinstance_routes = Router()

bookinstance_routes
  .get('/bookinstance/create', bookinstance_create_get)
  .post('/bookinstance/create', bookinstance_create_post)
  .get('/bookinstance/:id/delete', bookinstance_delete_get)
  .post('/bookinstance/:id/delete', bookinstance_delete_post)
  .get('/bookinstance/:id/update', bookinstance_update_get)
  .post('/bookinstance/:id/update', bookinstance_update_post)
  .get('/bookinstance/:id', bookinstance_detail)
  .get('/bookinstances', bookinstance_list)


export { bookinstance_routes }