import mongoose from 'mongoose';

import {app} from "./app";
import {NatsWrapper} from './nats-wrapper';

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT key should be defined');
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI should be defined');
    }

    try {
        await NatsWrapper.connect();
        NatsWrapper.client().on('close', () => {
            console.log('NATS connection closed');
            process.exit();
        });
        process.on('SIGINT', () => NatsWrapper.client().close());
        process.on('SIGTERM', () => NatsWrapper.client().close());

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Connected to mongodb');
    } catch (err) {
        console.error('Error connecting to mongodb');
        console.log(err);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000!');
        console.log('This deployment was successful!...');
    });
}

start();
