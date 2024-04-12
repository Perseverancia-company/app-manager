import express from "express";

import appsRouter from "./apps";

const mainRouter = express.Router();

mainRouter.use(appsRouter);

export default mainRouter;

