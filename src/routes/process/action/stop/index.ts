import express from "express";

import { Process } from "../..";
import { killAll } from "../../../../app/cmd/killAll";
import { Models } from "felixriddle.ts-app-models";
import stopByNameRouter from "./name";

const stopActionRouter = express.Router();

stopActionRouter.use("/name", stopByNameRouter);

stopActionRouter.get("/", (req, res) => {
    try {
        // const {
        //     app_name
        // } = req.params;
        
        return res.status(200).send({
            messages: [{
                error: false,
                message: "Ok"
            }]
        });
    } catch(err: any) {
        console.error(err);
        return res.status(500).send({
            messages: [{
                error: true,
                message: err.message,
            }]
        });
    }
});

stopActionRouter.post("/", async (req, res) => {
    try {
        console.log(`[POST] /process/action/stop`);
        
        const processInfo: Process = req.body;
        
        const {
            pid
        } = processInfo;
        
        // If kill all fails is because the shell has exited
        try {
            // Kill process and subprocesses
            killAll(pid, 9);
        } catch(err) { }
        
        // Remove the pid from the database
        const Process = new Models().process();
        const foundProcess: any = await Process.findOne({
            where: {
                name: processInfo.name
            }
        });
        
        // Found process
        if(foundProcess) {
            foundProcess.pid = null;
            
            // Save
            await foundProcess.save();
            
            // console.log(`Removed pid`);
        } else {
            // console.log(`Process information not found on the database`);
        }
        
        return res.status(200).send({
            messages: [{
                error: false,
                message: "Ok"
            }]
        });
    } catch(err: any) {
        console.error(err);
        return res.status(500).send({
            messages: [{
                error: true,
                message: err.message,
            }]
        });
    }
});

export default stopActionRouter;
