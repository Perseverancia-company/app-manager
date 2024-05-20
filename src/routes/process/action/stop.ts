import express from "express";
import { spawn } from 'child_process';

import { Process } from "..";
import { killAll } from "../../../app/cmd/killAll";

const stopActionRouter = express.Router();

stopActionRouter.get("/stop", (req, res) => {
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

stopActionRouter.post("/stop", (req, res) => {
    try {
        console.log(`[POST] /process/action/stop`);
        
        console.log(`Process info: `, req.body);
        const processInfo: Process = req.body;
        
        console.log(`Stopping app with name: ${processInfo.name}`);
        console.log(`Process info: `, processInfo);
        
        const {
            pid
        } = processInfo;
        
        console.log(`PID: `, pid);
        
        // Kill process and subprocesses
        killAll(pid, 9);
        
        // TODO: Remove the pid from the database
        
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
