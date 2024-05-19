import express from "express";
import stopActionRouter from "./stop";

const processActionRouter = express.Router();

processActionRouter.use(stopActionRouter);

export default processActionRouter;
