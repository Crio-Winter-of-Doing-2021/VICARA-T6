import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import {errorHandler, NotFoundError, currentUser} from '@vic-common/common';
import { fileDownloadRouter } from './routes/downloadFile';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === 'production'
}));
app.use(currentUser);

app.use(fileDownloadRouter);

app.all('*', () => {
    throw new NotFoundError('Route not found');
});

app.use(errorHandler);

export { app };
