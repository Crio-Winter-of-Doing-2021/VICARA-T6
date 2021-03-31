import express, {Request, Response} from "express";

import {currentUser, requireAuth, NotFoundError} from '@vic-common/common';
import {User} from '../models/user.model';
import {UserDeletedPublisher} from "../events/publishers";
import {NatsWrapper} from "../nats-wrapper";


const router = express.Router();

router.delete('/api/users/delete', currentUser, requireAuth, async (req: Request, res: Response) => {

    const deletedUser = await User.findByIdAndDelete(req.currentUser!.id);
    if (!deletedUser) {
        throw new NotFoundError('User does not exist');
    }
    new UserDeletedPublisher(NatsWrapper.client()).publish({
        id: deletedUser._id,
        email: deletedUser.email
    });

    req.session = null;
    res.send({deletedUser});
});

export default router;
