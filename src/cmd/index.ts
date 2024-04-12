import { ArgumentParser } from "argparse";
import runServer from "../server";

const parser = new ArgumentParser({
    description: "Good roots startup"
});

parser.add_argument("--serve", {
    help: "Run server",
    action: "store_true"
});

/**
 * Execute commands
 */
export default async function executeCommands() {
    const args = parser.parse_args();
    
    if(args.serve) {
        runServer();
    }
    
    // process.exit(0);
};

executeCommands();
