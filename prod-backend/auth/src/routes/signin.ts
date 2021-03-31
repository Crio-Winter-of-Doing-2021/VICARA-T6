import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import {validateRequest, BadRequestError} from "@vic-common/common";

import {PasswordManager} from "../services/password";
import {User} from '../models/user.model';

const router = express.Router();

router.post('/api/users/signin',
    [
        body('email')
            .notEmpty()
            .isEmail()
            .withMessage('Invalid Email'),
        body('password')
            .notEmpty()
            .withMessage('Password must be supplied')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {email, password} = req.body;
        const existingUser = await User.findOne({email});
        if (!existingUser) {
            throw new BadRequestError('Invalid Credentials');
        }

        const passwordsMatch = await PasswordManager.compare(
            existingUser.password,
            password
        );
        if (!passwordsMatch) {
            throw new BadRequestError('Invalid Credentials');
        }

        // Generate JWT
        const userJwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, process.env.JWT_KEY!, {
            expiresIn: '4h'
        });

        // Store it on cookie
        req.session = {
            jwt: userJwt
        };

        res.status(200).send(existingUser);
    }
    );

export default router;
