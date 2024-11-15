import { Server } from "socket.io";
import { Models } from "felixriddle.ts-app-models";

import App from "@/app/cmd/App";

export interface AppInfo {
    name: string,
    path: string,
    command: string,
    // Prefer script name over command name
    // because commands sometimes can't be executed directly from a shell
    // but npm can do execute them.
    scriptName?: string,
}

/**
 * Socket io CLI
 */
export default function socketioCli(models: Models, io: Server) {
    // Connection
    io.on('connection', (socket) => {
        // Run app command
        socket.on('run', async (appInfo: AppInfo) => {
            console.log(`Run app: `, appInfo.name);
            console.log(`Command: `, appInfo.command);
            
            const app = new App(appInfo.path, models, socket);
            await app.run(appInfo);
        });
    });
}
