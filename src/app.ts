import createError from 'http-errors';

import express, { RequestHandler, ErrorRequestHandler } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';
import { catalog_routes } from './routes/catalog';
import compression from 'compression'
import helmet from 'helmet'


class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routerSetup();
    this.errorHandler();
  }

  private config() {
    // view engine setup
    this.app
      .set('views', path.join(__dirname, 'views'))
      .set('view engine', 'pug');

    this.app
      .use(logger('dev'))
      .use(express.json())
      .use(express.urlencoded({ extended: false }))
      .use(cookieParser())
      .use(express.static(path.join(__dirname, 'public')))

    this.app
      .use(compression())
      .use(helmet())
  }

  private routerSetup() {
    this.app
      .use('/', indexRouter)
      .use('/catalog', catalog_routes)
  }

  private errorHandler() {
    // catch 404 and forward to error handler
    const requestHandler: RequestHandler = function (_req, _res, next) {
      next(createError(404));
    };
    this.app.use(requestHandler);

    // error handler
    const errorRequestHandler: ErrorRequestHandler = function (
      err,
      req,
      res,
      _next
    ) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render("error");
    };

    this.app.use(errorRequestHandler)
  }
}

export default new App().app;

