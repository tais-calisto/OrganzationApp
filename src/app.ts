import './util/module-alias';
import express from 'express';
import { createPool, Pool } from 'mysql2/promise';
import dotenv from 'dotenv';
import { router } from './router/router';
import morgan from 'morgan';

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
  }
}

export default new App();
