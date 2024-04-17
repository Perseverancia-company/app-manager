import { Socket } from "socket.io";
import { spawn } from 'child_process';

import { AppInfo } from "../../server/socketIoCli";

/**
 * Class to handle app commands with socket.io
 */
export default class AppCmd {
    appInfo: AppInfo;
    socket: Socket;
    
    constructor(appInfo: AppInfo, socket: Socket) {
        this.appInfo = appInfo;
        this.socket = socket;
    }
    
    /**
     * Run command
     * 
     * Splits the command and uses 'spawn'
     */
    run() {
        const appInfo = this.appInfo;
        
        try {
            // Split command and arguments
            const parts = appInfo.command.split(' ');
            const command = parts.shift();
            const args = parts;
            
            if(!command) {
                throw new Error("No command");
            }
            
            console.log(`Command: ${command}`);
            console.log(`Arguments: `, args);
            
            const npmCmd = spawn(command, args, {
                cwd: this.appInfo.path,
                env: process.env
            });
            
            // Take app output and send to the frontend
            const socket = this.socket;
            
            // Stdout
            // Emit app start
            socket.emit('app start', appInfo.name);
            console.log(`App started`);
            console.log(`Running app: `, appInfo);
            
            npmCmd.stdout.on('data', data => {
                const message = data.toString();
                console.log(`stdout: `, message);
                
                // Emit as output
                socket.emit("out", {
                    app: appInfo,
                    message,
                });
            });
            
            npmCmd.stdout.on('end', () => {
                console.log(`stdout: end`);
            });
            
            npmCmd.stdout.on('error', (msg) => {
                console.log(`stdout: error`, msg);
            });
            
            // Stderr
            npmCmd.stderr.on('data', data => {
                const message = data.toString();
                console.log(`stderr: ${data}`);
                
                // Emit as output
                socket.emit("err", {
                    app: appInfo,
                    message: message,
                });
            });
            
            // Commands are not showing anything on console
            npmCmd.on('message', (message) => {
                console.log(`Message event: `, message.toString());
            });
            npmCmd.on('exit', (message) => {
                console.log(`Exit message: `, message?.toString());
            });
            npmCmd.on('spawn', (message: any) => {
                console.log(`Spawn event: `, message);
            });
            npmCmd.on('disconnect', (message: any) => {
                console.log(`Disconnect event: `, message);
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
        } catch(err) {
            console.log(`Running app failed, app: `, appInfo);
            console.error(err);
        }
    }
}

