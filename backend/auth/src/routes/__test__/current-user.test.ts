import request from "supertest";

import {app} from '../../app';
import {signup} from "../../test/setup";

it('responds with details about current user', async () => {
    const cookie = await signup();

});

it('responds with null if not authenticated', async () => {
    const res = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200);
    expect(res.body.currentUser).toEqual(null);
});