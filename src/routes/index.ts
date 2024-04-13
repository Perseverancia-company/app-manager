import express from "express";

import appsRouter from "./apps";
import appRouter from "./app";

const mainRouter = express.Router();

mainRouter.use("/apps", appsRouter);
mainRouter.use("/app", appRouter);

export default mainRouter;

