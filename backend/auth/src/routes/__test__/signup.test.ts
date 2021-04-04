import request from 'supertest';
import { app } from "../../app";
import {NatsWrapper} from "../../nats-wrapper";

it('returns a 201 response on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
});

it('returns a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'testtest.com',
            password: 'password'
        })
        .expect(400);
});

it('returns a 400 with an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'pass'
        })
        .expect(400);
});

it('returns a 400 with missing password and email', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com'
        })
        .expect(400);
    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'password'
        })
        .expect(400);
});

it('disallows duplicate email signups', async () => {
    const req = {
        email: 'test@test.com',
        password: 'password'
    };
    await request(app)
        .post('/api/users/signup')
        .send(req)
        .expect(201);
    await request(app)
        .post('/api/users/signup')
        .send(req)
        .expect(400);
});

it('sets a cookie after successful signup', async () => {
    const res = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    expect(res.get('Set-Cookie')).toBeDefined();
});

it('publishes a user:created event', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    expect(NatsWrapper.client().publish).toHaveBeenCalled();
});
