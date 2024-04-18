import express from "express";

import appsRouter from "./apps";
import appRouter from "./app";
import processRouter from "./process";

const mainRouter = express.Router();

mainRouter.use("/apps", appsRouter);
mainRouter.use("/app", appRouter);
mainRouter.use("/process", processRouter);

export default mainRouter;
