import request from "supertest";

import {app} from "../../app";

it('clears cookie on sign out', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    const res = await request(app)
        .post('/api/users/signout')
        .send({})
        .expect(200);

    expect(res.get('Set-Cookie')[0].split(';')[0] === 'express:sess=');
});
