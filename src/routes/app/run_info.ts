import express from "express";
import { Models } from "felixriddle.ts-app-models";

const runInfoRouter = express.Router();

runInfoRouter.get("/run_info", async (req, res) => {
    try {
        const {
            app_name
        } = req.query;
        
        const models = new Models();
        const Process = models.process();
        
        // Fetch app information
        const result: any = await Process.findOne({
            where: {
                name: app_name
            }
        });
        
        return res.status(500).send({
            // Actual data
            isRunning: result.pid ? true : false,
            pid: result.pid,
            url: result.url,
            appType: result.appType,
            
            messages: [{
                error: false,
                message: "Ok"
            }]
        });
    } catch(err) {
        console.error(err);
        
        return res.status(500).send({
            messages: [{
                error: true,
                message: err.message
            }]
        });
    }
});
