import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cors from 'cors';
import cookieSession from 'cookie-session';
import {errorHandler, NotFoundError, currentUser} from '@vic-common/common';

// Importing file routers
import { createFileRouter } from "./routes/newFile";
import { deleteFileRouter } from "./routes/deleteFile";
// Importing folder routers
import { createFolderRouter } from './routes/newFolder';
import { deleteFolderRouter } from './routes/deleteFolder';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none'
}));
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(currentUser);

// Adding routers
app.use(createFileRouter);
app.use(deleteFileRouter);
app.use(createFolderRouter);
app.use(deleteFolderRouter);

app.all('*', () => {
    throw new NotFoundError('Route not found');
});

app.use(errorHandler);

export { app };
