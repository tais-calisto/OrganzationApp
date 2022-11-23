import './util/module-alias';
import app from './app';

const port = process.env.PORT || 5000;

app.express.listen(port);

app.databasePool();
