import express, {Request, Response} from "express";
const router = express.Router();

import {currentUser, requireAuth} from "@vic-common/common";

router.get('/api/users/currentuser', currentUser, (req: Request, res: Response) => {
    res.send({currentUser: req.currentUser || null});
});

export default router;
