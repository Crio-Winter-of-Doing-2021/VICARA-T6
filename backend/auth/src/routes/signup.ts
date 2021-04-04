import express, {Request, Response} from "express";
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import {validateRequest, BadRequestError} from '@vic-common/common';
import {User} from '../models/user.model';
import {UserCreatedPublisher} from "../events/publishers";
import {NatsWrapper} from "../nats-wrapper";

const router = express.Router();

router.post('/api/users/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .isLength({min: 6})
            .withMessage('Password should be at least 6 characters long')
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const {email, password} = req.body;

        const existingUser = await User.findOne({email});

        if (existingUser) {
            throw new BadRequestError('Email is taken');
        }

        const user = User.build({email, password});
        await user.save();
        new UserCreatedPublisher(NatsWrapper.client()).publish({
            id: user._id,
            email: user.email,
        });

        // Generate JWT
        const userJwt = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY!, {
            expiresIn: '4h'
        });

        // Store it on cookie
        req.session = {
            jwt: userJwt
        };

        res.status(201).send(user);
    }
);

export default router;
