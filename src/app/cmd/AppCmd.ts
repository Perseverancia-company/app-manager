import { Socket } from "socket.io";
import { spawn } from 'child_process';
import { Models } from "felixriddle.ts-app-models";
import { upsertProcessInfo } from "felixriddle.pid-discovery";

import { AppInfo } from "@/server/socketIoCli";

/**
 * Class to handle app commands with socket.io
 * 
 * @deprecated use 'App' instead
 */
export default class AppCmd {
    appInfo: AppInfo;
    socket: Socket;
    models: Models;
    
    constructor(appInfo: AppInfo, socket: Socket, models: Models) {
        this.appInfo = appInfo;
        this.socket = socket;
        this.models = models;
    }
    
    /**
     * Run an app that has complex command initialization
     * 
     * These apps are hard to start and track output and other streams because
     * we can't just simply pass the command in.
     * 
     * We've got to spawn a shell, and inside it pass the command.
     * The problem is that I think the stream ends when we do this.
     */
    async runCommand() {
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
        if(npmCmd.pid) {
            console.log(`Shell pid: `, npmCmd.pid);
            
            // Insert app information on the database
            await upsertProcessInfo({
                name: appInfo.name,
                pid: npmCmd.pid,
                appType: "application",
                url: "",
            });
        }
        
        // Take app output and send to the frontend
        const socket = this.socket;
        
        // Stdout
        // Emit app start
        socket.emit('app start', appInfo.name);
        
        const pretext = "[Shell]";
        npmCmd.stdout.on('data', data => {
            const message: string = data.toString();
            // console.log(`${pretext} stdout: `, message);
            
            const { AppOutput } = this.models;
            
            // Insert
            AppOutput.create({
                appName: appInfo.name,
                output: message,
            });
            
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
    async run() {
        const appInfo = this.appInfo;
        
        try {
            await this.runCommand();
        } catch(err) {
            console.log(`Running app failed, app: `, appInfo);
            console.error(err);
        }
    }
}

