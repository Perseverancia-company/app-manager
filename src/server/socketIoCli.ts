import { spawn } from 'child_process';
import { Server } from "socket.io";

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
        console.log(`A user connected`);
        
        // Run app in dev mode
        socket.on('run', (appInfo: AppInfo) => {
            // Show colors
            process.env.FORCE_COLOR = 'true';
            
            const npmCmd = spawn('sh', ["-s", `${appInfo.command}`], {
                cwd: appInfo.path,
                env: process.env
            });
            
            // Emit app start
            socket.emit('app start', appInfo.name);
            
            npmCmd.stdout.on('data', data => {
                console.log(`stdout: ${data}`);
                
                // Emit as output
                io.emit("out", {
                    app: appInfo,
                    message: data,
                });
            });
            
            npmCmd.stderr.on('data', data => {
                console.log(`stderr: ${data}`);
                
                // Emit as output
                io.emit("out", {
                    app: appInfo,
                    message: data,
                });
            });
            
            npmCmd.on('error', (error) => {
                console.log(`error: ${error.message}`);
                
                // Emit error
                socket.emit('app error', error.message);
                
                // On error disconnect
                socket.disconnect();
            });
            
            npmCmd.on("close", code => {
                console.log(`child process exited with code ${code}`);
                
                // Disconnect
                socket.disconnect();
            });
        });
    });
}

