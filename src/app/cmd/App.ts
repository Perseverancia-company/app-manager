import { spawn } from 'child_process';
import { Models } from 'felixriddle.ts-app-models';
import { Socket } from 'socket.io';
import { upsertProcessInfo } from 'felixriddle.pid-discovery';

import AppData from "../../apps/AppData";
import removeAppPid from '../../database/process';

/**
 * App abstraction
 * 
 */
export default class App {
    appData: AppData;
    socket?: Socket;
    
    // --- Constructors ---
    /**
     * Constructor
     */
    constructor(path: string, socket?: Socket) {
        this.appData = new AppData(path);
        
        this.socket = socket;
    }
    
    // --- App scripts ---
    /**
     * Run command on the app directory
     */
    async run(cmd: string) {
        const appName = this.appData.packageJson.name;
        const appInfo = {
            name: appName,
            command: cmd,
            path: this.appData.path,
        };
        
        console.log(`Running command '${cmd}' in a shell`);
        
        const npmCmd = spawn(cmd, [], {
            // Run in a shell, so that it can set environment variables, run multiple commands, etc.
            shell: true,
            cwd: this.appData.path,
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
                name: appName,
                pid: npmCmd.pid,
                appType: "application",
                url: "",
            });
        }
        
        // Take app output and send to the frontend
        const socket = this.socket;
        if(socket) {
            socket.emit('app start', appName);
        }
        
        const pretext = "[Shell]";
        npmCmd.stdout.on('data', data => {
            const message: string = data.toString();
            // console.log(`${pretext} stdout: `, message);
            
            const AppOutput = new Models().appOutput;
            
            // Insert
            AppOutput.create({
                appName: appName,
                output: message,
            });
            
            if(socket) {
                // Emit as output
                socket.emit("out", {
                    app: appInfo,
                    message,
                });
            }
        });
        
        // Stderr
        npmCmd.stderr.on('data', data => {
            const message = data.toString();
            console.log(`${pretext} stderr: ${data}`);
            
            if(socket) {
                // Emit as output
                socket.emit("err", {
                    app: appInfo,
                    message: message,
                });
            }
        });
        
        // Process
        const Process = new Models().process();
        npmCmd.on('error', async (error) => {
            // console.log(`child process exited with error: ${error}`);
            
            try {
                await removeAppPid(appName, Process);
            } catch(err) { }
            
            if(socket) {
                // Emit error
                socket.emit('app error', error.message);
                
                // On error disconnect
                socket.disconnect();
            }
        });
        
        npmCmd.on("close", async (code) => {
            // console.log(`child process exited with code ${code}`);
            
            try {
                await removeAppPid(appName, Process);
            } catch(err) { }
            
            if(socket) {
                // Disconnect
                socket.disconnect();
            }
        });
    }
}
