/**
 * This router is for projects at: "~/Repositories/Javascript"
 */
import express from "express";
import AppData from "../../../../apps/AppData";
import { projectsPath } from "../../../../apps/Apps";

const javascriptRouter = express.Router();

javascriptRouter.get("/", async (req, res) => {
    try {
        
        // Read apps and get their information
        const {
            name 
        } = req.query;
        
        console.log(`[GET] /app/repository/javascript?name=${name}`);
        
        const app = new AppData(`${projectsPath()}/${name}`);
        console.log(`App name: `, app.name);
        
        await app.fetchAppRunningProcessData();
        
        return res.status(200)
            .send({
                app,
                messages: [{
                    error: false,
                    message: "Ok"
                }]
            });
    } catch(err: any) {
        console.error(err);
        
        return res.status(500).json({
            messages: [{
                error: true,
                message: err.message,
            }]
        });
    }
});

export default javascriptRouter;

