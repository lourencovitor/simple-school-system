import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';

import routes from './routes';

class App {
  public express: express.Application;

  public constructor() {
    this.express = express();

    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.express.use(express.json());
    this.express.use(cors());
  }

  private routes(): void {
    interface ResponseError extends Error {
      status?: number;
    }

    this.express.use(routes);
    this.express.use((req, res, next) => {
      const error: ResponseError = new Error('Not found');
      error.status = 404;
      next(error);
    });

    this.express.use(
      (
        error: ResponseError,
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        res.status(error.status || 500);
        res.json({ error: error.message });
      }
    );
  }
}

export default new App().express;
