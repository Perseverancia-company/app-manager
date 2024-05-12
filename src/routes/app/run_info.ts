import express from "express";
import { Models } from "felixriddle.ts-app-models";

const runInfoRouter = express.Router();

/**
 * Get process or falsy data
 */
export async function getProcessOrFalsyData(appName: string) {
    const models = new Models();
    const Process = models.process();
    
    // Fetch app information
    const result: any = await Process.findOne({
        where: {
            name: appName
        }
    });
    
    return {
        // Actual data
        isRunning: result?.pid ? true : false,
        pid: result?.pid ? result.pid : undefined,
        url: result?.url ? result.url : undefined,
        appType: result?.appType ? result.appType : undefined,
    };
}

runInfoRouter.get("/run_info", async (req, res) => {
    const debug = false;
    
    try {
        if(debug) {
            console.log(`[GET] /app/run_info`);
        }
        
        const {
            app_name
        } = req.query;
        
        if(debug) {
            console.log(`[GET] /app/run_info?app_name=${app_name}`);
        }
        
        const result = await getProcessOrFalsyData(String(app_name));
        
        return res.status(200).send({
            ...result,
            
            messages: [{
                error: false,
                message: "Ok"
            }]
        });
    } catch(err: any) {
        // This fails often
        console.error(err);
        
        return res.status(500).send({
            messages: [{
                error: true,
                message: err.message
            }]
        });
    }
});

export default runInfoRouter;
