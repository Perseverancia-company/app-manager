import { Server } from "socket.io";
import AppCmd from '../app/cmd/AppCmd';

export interface AppInfo {
    name: string,
    path: string,
    command: string,
}

/**
 * Socket io CLI
 */
export default function socketioCli(io: Server) {
    // Connection
    io.on('connection', (socket) => {
        // Run app command
        socket.on('run', (appInfo: AppInfo) => {
            console.log(`Run app: `, appInfo.name);
            console.log(`Command: `, appInfo.command);
            
            const appCmd = new AppCmd(appInfo, socket);
            appCmd.run();
        });
    });
}
