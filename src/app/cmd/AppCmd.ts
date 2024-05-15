import { Socket } from "socket.io";
import { spawn } from 'child_process';

import { AppInfo } from "../../server/socketIoCli";

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
     * Update app information on the database
     */
    async updateAppInfo(pid: number) {
        const appInfo = this.appInfo;
        
        // Insert / Update process to the database
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
        
        return await fetch(`${url}/process`, {
            method: "POST",
            headers,
            body: JSON.stringify(data)
        });
    }
    
    /**
     * Run an app that has complex command initialization
     * 
     * These apps are hard to start and track output and other streams because we can't just simply pass the command in.
     * 
     * We've got to spawn a shell, and inside it pass the command.
     * The problem is that I think the stream ends when we do this.
     */
    runCommand(): void {
        const appInfo = this.appInfo;
        const cmd = appInfo.command;
        
        console.log(`Running command '${cmd}' in a shell`);
        
        const npmCmd = spawn(cmd, [], {
            // Run in a shell, so that it can set environment variables, run multiple commands, etc.
            shell: true,
            cwd: this.appInfo.path,
            env: process.env,
            // To be able to kill all child processes, we need to detach the process
            detached: true,
        });
        
        // Note
        // Tested that this function is being called multiple times
        // And also npmCmd is often times undefined
        if(npmCmd) {
            console.log(`Shell pid: `, npmCmd.pid);
        }
        
        // Take app output and send to the frontend
        const socket = this.socket;
        
        // We can't update the pid becuase it's the
        // pid of the shell and not the pid of the command
        // // Update app info on the database
        // this.updateAppInfo(pid);
        
        // Stdout
        // Emit app start
        socket.emit('app start', appInfo.name);
        
        const pretext = "[Shell]";
        npmCmd.stdout.on('data', data => {
            const message = data.toString();
            // console.log(`${pretext} stdout: `, message);
            
            // Emit as output
            socket.emit("out", {
                app: appInfo,
                message,
            });
        });
        
        // Stderr
        npmCmd.stderr.on('data', data => {
            const message = data.toString();
            console.log(`${pretext} stderr: ${data}`);
            
            // Emit as output
            socket.emit("err", {
                app: appInfo,
                message: message,
            });
        });
        
        npmCmd.on('error', (error) => {
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
    }
    
    /**
     * Run command
     * 
     * Splits the command and uses 'spawn'
     */
    run() {
        const appInfo = this.appInfo;
        
        try {
            this.runCommand();
        } catch(err) {
            console.log(`Running app failed, app: `, appInfo);
            console.error(err);
        }
    }
}

