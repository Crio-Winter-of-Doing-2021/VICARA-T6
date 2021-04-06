import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cors from 'cors';
import cookieSession from 'cookie-session';
import {currentUser, errorHandler, NotFoundError, requireAuth} from '@vic-common/common';

import {fileDownloadRouter} from "./routes/downloadFile";
import {downloadFolderRouter} from "./routes/downloadFolder";
import {copyFilesRouter} from "./routes/copyFiles";

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

app.use(fileDownloadRouter);
app.use(downloadFolderRouter);
app.use(copyFilesRouter);

app.all('*', () => {
    throw new NotFoundError('Route not found');
});

app.use(errorHandler);

export { app };