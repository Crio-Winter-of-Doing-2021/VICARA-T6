import express, {Request, Response} from "express";

const router = express.Router();

router.get('/api/downloads/file', async (req: Request, res: Response) => {
    res.send({});
});

export {router as fileDownloadRouter}
