import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';

import * as middlewares from './middlewares';
import routes from './routes/bowlingRoute';

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use('/api/bowling', routes);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
 
export default app;