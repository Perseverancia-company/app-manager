import { ArgumentParser } from "argparse";
import runServer from "../server";
import executeTests from "./test";
import dotenv from "dotenv";
import resetPids from "../db/process/resetPids";
import updateAppInfo from "felixriddle.pid-discovery";
import enableAppStartup from "./commands/enableStartup";

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
        // Only update if the process is sticking around
        updateAppInfo();
        
        runServer();
    }
    
    if(args.enable_startup) {
        enableAppStartup();
    }
    
    await executeTests(args);
    
    // process.exit(0);
};

executeCommands();
