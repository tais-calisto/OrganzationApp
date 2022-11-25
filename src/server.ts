import 'express-async-errors';
import './util/module-alias';
import app from './app';
import { errorHandlingMiddleware } from './middlewares/errorHandling';

const port = process.env.PORT || 5000;

app.express.listen(port);

app.express.use(errorHandlingMiddleware.notFound);
app.express.use(errorHandlingMiddleware.globalErrorHandler);
