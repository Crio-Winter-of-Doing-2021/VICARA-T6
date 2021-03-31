import request from "supertest";

import {app} from "../../app";
import {response} from "express";

it('fails on invalid email in request', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
});

it('fails on incorrect password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'wrongpass'
        })
        .expect(400);
});

it('responds with cookie on getting valid credentials', async () => {
    const req = {
        email: 'test@test.com',
        password: 'password'
    };
    await request(app)
        .post('/api/users/signup')
        .send(req)
        .expect(201);
    const res = await request(app)
        .post('/api/users/signin')
        .send(req)
        .expect(200);
    expect(res.get('Set-Cookie')).toBeDefined();
});