import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import jwt from 'jsonwebtoken';

export const signup = () => {
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    };
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    const session = {jwt: token};
    const jsonSession = JSON.stringify(session);
    const base64 = Buffer.from(jsonSession).toString('base64');
    return [`express:sess=${base64}`];
};

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'testkey';
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let coll of collections) {
        await coll.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});