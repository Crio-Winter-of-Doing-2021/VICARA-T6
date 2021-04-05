import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cors from 'cors';
import cookieSession from 'cookie-session';

import {errorHandler, NotFoundError, currentUser, requireAuth} from '@vic-common/common';
import { fileDownloadRouter } from './routes/downloadFile';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none'
}));
// app.use(cors({
//     origin: true,
//     credentials: true
// }));
app.use((req, res, next) => {
    // const allowedOrigins = ['http://127.0.0.1:8020', 'http://localhost:8020', 'http://127.0.0.1:9000', 'http://localhost:9000'];
    const origin = req.headers.origin!;
    res.setHeader('Access-Control-Allow-Origin', origin);
    //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
    // res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return next();
});

app.use(currentUser);
app.use(requireAuth);

app.use(fileDownloadRouter);

app.all('*', () => {
    throw new NotFoundError('Route not found');
});

app.use(errorHandler);

export { app };
