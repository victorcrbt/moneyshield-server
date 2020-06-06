import express, { Application } from 'express';

import routes from './routes';

export default class App {
  public server: Application;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  private middlewares() {
    this.server.use(express.json());
  }

  private routes() {
    this.server.use(routes);
  }
}
