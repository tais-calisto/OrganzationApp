import './util/module-alias';
import express from 'express';
import { createPool, Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export class App {
  public express: express.Application;

  public constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    //json
    //cors
  }

  public async databasePool() {
    await createPool({
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      host: process.env.MYSQLHOST,
      port: parseInt(process.env.MYSQLPORT || ''),
      database: process.env.MYSQLDATABASE,
    });
  }

  private routes(): void {
    //this.express.get()
  }
}

export default new App();
