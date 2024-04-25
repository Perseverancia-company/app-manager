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
     * Run node app
     * 
     * A normal node app is simpler to run
     */
    runNodeApp(command: string, args: string[]): void {
        const appInfo = this.appInfo;
        
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
        
        // Update app info on the database
        this.updateAppInfo(pid);
        
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
    }
    
    /**
     * Update app information on the database
     */
    updateAppInfo(pid: number): void {
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
        fetch(`${url}/process`, {
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
    runComplexCommand(): void {
        const appInfo = this.appInfo;
        
        console.log(`Running command '${appInfo.command}' in a shell`);
        
        const npmCmd = spawn(appInfo.command, [], {
            // Run in a shell, so that it can set environment variables, run multiple commands, etc.
            shell: true,
            cwd: this.appInfo.path,
            env: process.env
        });
        
        // Take app output and send to the frontend
        const socket = this.socket;
        
        // We can't update the pid becuase it's the
        // pid of the shell and not the pid of the command
        // // Update app info on the database
        // this.updateAppInfo(pid);
        
        // Stdout
        // Emit app start
        socket.emit('app start', appInfo.name);
        console.log(`App started`);
        console.log(`Running app: `, appInfo);
        
        const pretext = "[Shell]";
        npmCmd.stdout.on('data', data => {
            const message = data.toString();
            console.log(`${pretext} stdout: `, message);
            
            // Emit as output
            socket.emit("out", {
                app: appInfo,
                message,
            });
        });
        
        npmCmd.stdout.on('end', () => {
            console.log(`${pretext} stdout: end`);
        });
        
        npmCmd.stdout.on('error', (msg) => {
            console.log(`${pretext} stdout: error`, msg);
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
            console.log(`${pretext} error: ${error.message}`);
            
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
            this.runComplexCommand();
        } catch(err) {
            console.log(`Running app failed, app: `, appInfo);
            console.error(err);
        }
    }
}

