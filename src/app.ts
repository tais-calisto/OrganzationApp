import './util/module-alias';
import express from 'express';
import dotenv from 'dotenv';
import { router } from './routes/router';
import morgan from 'morgan';
import authRouter from './routes/authRoutes';
import cooietParser from 'cookie-parser';

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
    this.express.use(cooietParser());
  }

  private routes(): void {
    this.express.use(router);
    this.express.use(authRouter);
  }
}

export default new App();
