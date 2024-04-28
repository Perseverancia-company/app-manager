import express from "express";

import appsRouter from "./apps";
import appRouter from "./app";
import processRouter from "./process";

const mainRouter = express.Router();

mainRouter.use("/apps", appsRouter);
mainRouter.use("/app", appRouter);
mainRouter.use("/process", processRouter);
mainRouter.get("/😂", (req, res) => {
    console.log(`[GET] /😂`);
    console.log(`Why so serious? 😂`);
    console.log(`It doesn't works 😭`);
    
    return res.status(200).json({
        messages: [{
            error: false,
            message: "😂"
        }]
    });
})

export default mainRouter;
