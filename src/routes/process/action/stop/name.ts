import express from "express";
import { killAll } from "../../../../app/cmd/killAll";
import { Models } from "felixriddle.ts-app-models";

const stopByNameRouter = express.Router();

/**
 * Stop app by name
 */
stopByNameRouter.get("/", async (req, res) => {
    try {
        const {
            name
        } = req.query;
        
        console.log(`[GET] /process/action/stop/name?name=${name}`);
        
        const Process = new Models().process();
        const foundProcess: any = await Process.findOne({
            where: {
                name
            }
        });
        
        // If kill all fails is because the shell has exited
        try {
            // Kill process and subprocesses
            killAll(foundProcess.pid, 9);
            console.log(`App ${name} terminated`);
        } catch(err) {
            
        }
        
        // Remove the pid from the database
        foundProcess.pid = null;
        
        // Save
        await foundProcess.save();
        
        return res.status(200).send({
            messages: [{
                error: false,
                message: "Ok"
            }]
        });
    } catch(err: any) {
        return res.status(500).send({
            messages: [{
                error: true,
                message: err.message,
            }]
        });
    }
});

export default stopByNameRouter;

