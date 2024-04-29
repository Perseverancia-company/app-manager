import express from "express";
import javascriptRouter from "./javascript";

const repositoryRouter = express.Router();

repositoryRouter.use(`/javascript`, javascriptRouter);

export default repositoryRouter;

