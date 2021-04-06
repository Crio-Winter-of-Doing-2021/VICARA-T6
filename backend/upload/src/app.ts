import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cors from 'cors';
import cookieSession from 'cookie-session';
import {currentUser, errorHandler, NotFoundError, requireAuth} from '@vic-common/common';

import {deleteFileRouter} from "./routes/deleteFile";
import {deleteFolderRouter} from "./routes/deleteFolder";
import {uploadFileRouter} from "./routes/uploadFile";
import {createFolderRouter} from "./routes/newFolder";

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

app.use(currentUser);
app.use(requireAuth);

app.use(uploadFileRouter);
app.use(createFolderRouter);
app.use(deleteFileRouter);
app.use(deleteFolderRouter);

app.all('*', () => {
    throw new NotFoundError('Route not found');
});

app.use(errorHandler);

export { app };
