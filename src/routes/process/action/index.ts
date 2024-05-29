import express from "express";
import stopActionRouter from "./stop/index";

const processActionRouter = express.Router();

processActionRouter.use("/stop", stopActionRouter);

export default processActionRouter;
