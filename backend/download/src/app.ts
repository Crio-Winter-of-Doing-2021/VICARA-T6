import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cors from 'cors';
import cookieSession from 'cookie-session';
import {errorHandler, NotFoundError} from '@vic-common/common';

import {fileDownloadRouter} from "./routes/downloadFile";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none'
}));
// const whitelist = ['http://localhost:3000', 'https://vigorous-dijkstra-746efd.netlify.app'];
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(fileDownloadRouter);

app.all('*', () => {
    throw new NotFoundError('Route not found');
});

app.use(errorHandler);

export { app };