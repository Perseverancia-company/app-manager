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
        // console.log(`A user connected`);
        
        // Run app in dev mode
        socket.on('run', (appInfo: AppInfo) => {
            console.log(`Run app: `, appInfo);
            
            const appCmd = new AppCmd(appInfo, socket);
            appCmd.run();
            
            console.log(`End run`);
        });
    });
}
