import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cors from "cors";
import cookieSession from "cookie-session";
import {
  currentUser,
  errorHandler,
  NotFoundError,
  requireAuth,
} from "@vic-common/common";

import { ancestorRouter } from "./routes/getAncestors";
import { getRootDirRouter } from "./routes/getRootDir";
import { getFileRouter } from "./routes/getFiles";
import { storageRouter } from "./routes/getAvailableStorage";
import { starRouter } from "./routes/starFiles";
import { recentRouter } from "./routes/getRecentFiles";
import { searchFileRouter } from "./routes/searchFiles";
import { moveFileRouter } from "./routes/moveFiles";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(currentUser);
app.use(requireAuth);

app.use(ancestorRouter);
app.use(getRootDirRouter);
app.use(getFileRouter);
app.use(storageRouter);
app.use(starRouter);
app.use(recentRouter);
app.use(searchFileRouter);
app.use(moveFileRouter);

app.all("*", () => {
  throw new NotFoundError("Route not found");
});

app.use(errorHandler);

export { app };
