import { ArgumentParser } from "argparse";
import dotenv from "dotenv";

import { updateAppInfo } from "felixriddle.pid-discovery";

import runServer from "../server";
import executeTests from "./test";
import resetPids from "../db/process/resetPids";
import enableAppStartup from "./commands/enableStartup";
import updateDatabaseApps from "../database/updateDatabaseApps";
import { deleteAllProcessesOutput } from "../apps/Output";

const parser = new ArgumentParser({
    description: "Good roots startup"
});

parser.add_argument("--serve", {
    help: "Run server",
    action: "store_true"
});

parser.add_argument("--test", {
    help: "Run tests",
    action: "store_true"
});

parser.add_argument("--enable-startup", {
    help: "Start app at startup",
    action: "store_true"
});

/**
 * Execute commands
 */
export default async function executeCommands() {
    dotenv.config();
    
    // Reset pids on startup
    await resetPids();
    
    const args = parser.parse_args();
    
    if(args.serve) {
        try {
            // Only update if the process is sticking around
            // It uses this very app, this works only if the server is running.
            await updateAppInfo();
        } catch(err) {
        }
        
        try {
            // Delete all processes output
            await deleteAllProcessesOutput();
        } catch(err: any) {
            
        }
        
        // Update apps in the database
        updateDatabaseApps();
        
        runServer();
    }
    
    if(args.enable_startup) {
        enableAppStartup();
    }
    
    await executeTests(args);
    
    // process.exit(0);
};

executeCommands();
