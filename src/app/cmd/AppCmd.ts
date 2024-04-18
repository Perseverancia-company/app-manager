import { Socket } from "socket.io";
import { spawn } from 'child_process';

import { AppInfo } from "../../server/socketIoCli";
import { Axios } from "axios";

/**
 * Class to handle app commands with socket.io
 * 
 * Some of my apps use scripts which invoke many commands, avoid using those here, because it's gonna break everything
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
            
            // Get pid
            const pid = npmCmd.pid;
            if(!pid) {
                // Emit as output
                socket.emit("err", {
                    app: appInfo,
                    message: "[Error] Couldn't get the pid of the process",
                });
                return;
            }
            console.log(`Process pid: ${pid}`);
            
            // Insert process to the database
            const url = `http://localhost:${process.env.PORT}`;
            const headers = {
                "Content-Type": "application/json"
            };
            const data = {
                name: appInfo.name,
                pid,
                appType: "application",
                url: ``,
            };
            if(false) {
                const axiosInstance = new Axios({
                    baseURL: url,
                    headers,
                });
                axiosInstance.post("/process", data).then((res) => res)
                    .catch((err) => {
                        console.log(`Axios error`);
                        console.error(err);
                    });
            } else {
                fetch(`${url}/process`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify(data)
                });
            }
            
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
            npmCmd.on('spawn', () => {
                console.log(`Spawn event`);
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

