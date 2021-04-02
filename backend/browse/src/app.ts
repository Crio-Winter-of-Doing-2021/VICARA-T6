import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {errorHandler, NotFoundError, currentUser, requireAuth} from '@vic-common/common';

import { getDirRouter } from './routes/getDirectory';
import { getFileRouter } from './routes/getFile';
import { getRootDirRouter } from './routes/getRootDir';
import { fileUpdateRouter } from "./routes/updateFile";
import { ancestorRouter } from "./routes/getAncestors";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUser);
app.use(requireAuth);

// Adding routers
app.use(getRootDirRouter);
app.use(getFileRouter);
app.use(getDirRouter);
app.use(fileUpdateRouter);
app.use(ancestorRouter);

app.all('*', () => {
    throw new NotFoundError('Route not found');
});

app.use(errorHandler);

export { app };
