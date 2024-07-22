import express from "express";
import { nodeProcessesForcedAwait } from "felixriddle.app-processes";
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

/**
 * Get process running information
 * 
 * NOTE: This function is too slow, because it waits for a sucessful response
 * 
 * This has to be executed from an asynchronous function on many apps to be effective.
 */
export async function getProcessRunningInfo(appName: string) {
    return new Promise(async (resolve, reject) => {
        const result = await getProcessOrFalsyData(appName);
        
        // If the app is running send the data directly
        if(result.pid) {
            return resolve(result);
        } else {
            // Otherwise the app may have been launched before app-manager
            // try to check that
            
            // The processes data here is fetched with system commands and is obtained through callbacks.
            // Try to send the data inside the callback
            await nodeProcessesForcedAwait((processes) => {
                // console.log(`Processes: `, processes);
                // console.log(`Looking for: `, appName);
                
                for(let proc of processes) {
                    if(proc.name === appName) {
                        // console.log(`Found app with name ${appName}`);
                        
                        result.isRunning = true;
                        result.pid = proc.pid;
                        break;
                    }
                }
                
                // Whether it's running or not it will return the data
                return resolve(result);
            });
            
            setTimeout(() => {
                // Resolve with normal data
                return resolve(result);
            }, 1000);
        }
    });
}

runInfoRouter.get("/run_info", async (req, res) => {
    try {
        const {
            app_name
        } = req.query;
        
        const appName = String(app_name);
        
        const result = await getProcessOrFalsyData(appName);
        
        // If the app is running send the data directly
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
