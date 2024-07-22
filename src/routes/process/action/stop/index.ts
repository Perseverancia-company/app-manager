import express from "express";

import { Process } from "../..";
import { killAll } from "../../../../app/cmd/killAll";
import { Models } from "felixriddle.ts-app-models";
import stopByNameRouter from "./name";
import { nodeProcessesForcedAwait } from "felixriddle.app-processes";

const stopActionRouter = express.Router();

stopActionRouter.use("/name", stopByNameRouter);

stopActionRouter.get("/", (req, res) => {
    try {
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

/**
 * 
 * @deprecated Use '[GET] /process/action/stop/name?name=APP_NAME' instead, as this one has a tiny chance that
 * a dodgy process may escape
 */
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
        
        // That doesn't work sometimes
        // So let's try again with another method
        try {
            await nodeProcessesForcedAwait((processes) => {
                console.log(`Processes: `, processes);
                for(let proc of processes) {
                    if(proc.pid === pid) {
                        // 15 SIGTERM
                        // 9 SIGKILL
                        process.kill(proc.pid, 9);
                        console.log(`Found app with name ${name}, terminating...`);
                    }
                }
            });
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
