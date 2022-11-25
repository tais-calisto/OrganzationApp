import { connect } from '@src/database';
import { Request, Response } from 'express';

class TestController {
  public home(req: Request, res: Response) {
    res.json({ message: 'Tudo certo' });
  }
}
class TestDB {
  public async home(req: Request, res: Response) {
    const conn = await connect();
    const test = await conn.query('SELECT * from user_tbl');
    res.json(test);
  }
}

export const homeController = new TestController();
export const testDBController = new TestDB();
