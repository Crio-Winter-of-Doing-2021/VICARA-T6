import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {errorHandler, NotFoundError} from '@vic-common/common';

import signinRouter from './routes/signin';
import signoutRouter from "./routes/signout";
import signupRouter from "./routes/signup";
import currentUserRouter from './routes/current-user';
import deleteUserRouter from './routes/terminate';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: false
}));

app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(currentUserRouter);
app.use(deleteUserRouter);

app.all('*', () => {
    throw new NotFoundError('Route not found');
});

app.use(errorHandler);

export { app };