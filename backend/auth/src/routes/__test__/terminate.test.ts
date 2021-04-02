import request from "supertest";

import {app} from "../../app";
import {signup} from "../../test/setup";
import {NatsWrapper} from "../../nats-wrapper";

it('deletes an existing user, unsets cookie and publishes user:deleted event', async () => {
    const cookie = await signup();
    const res = await request(app)
        .delete('/api/users/delete')
        .set('Cookie', cookie)
        .expect(200);
    expect(res.body.deletedUser.email).toEqual('test@test.com');
    expect(res.get('Set-Cookie')[0].split(';')[0] === 'express:sess=');
    expect(NatsWrapper.client().publish).toHaveBeenCalled();
});
