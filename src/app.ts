import './util/module-alias';
import express from 'express';
import dotenv from 'dotenv';
import { router } from './routes/router';
import morgan from 'morgan';
import authRouter from './routes/authRoutes';

dotenv.config();

export class App {
  public express: express.Application;

  public constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.express.use(morgan('tiny'));
    this.express.use(express.json());
  }

  private routes(): void {
    this.express.use(router);
    this.express.use(authRouter);
  }
}

export default new App();
