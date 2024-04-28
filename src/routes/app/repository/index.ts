import express from "express";
import javascriptRouter from "./javascript";

const repositoryRouter = express.Router();

repositoryRouter.use(javascriptRouter);

export default repositoryRouter;

