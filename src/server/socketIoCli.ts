import { spawn } from 'child_process';
import { Server } from "socket.io";
import AppCmd from '../app/cmd/AppCmd';

export interface AppInfo {
    name: string,
    path: string,
    command: string,
}

/**
 * That
 */
// function runWithSh() {
    
//     try {
//         // Problem
//         // If you do sh -s, then stdout doesn't show anything
//         // The problem is that most of my apps will run many commands in a single script
//         // Let's first split it and handle the easy ones first
//         // const npmCmd = spawn('sh', ["-s", `${appInfo.command}`], {
//         //     cwd: appInfo.path,
//         //     env: process.env
//         // });
        
//         const npmCmd = spawn('sh', ["-s", `${appInfo.command}`], {
//             cwd: appInfo.path,
//             env: process.env
//         });
        
//         // Stdout
//         // Emit app start
//         socket.emit('app start', appInfo.name);
//         console.log(`App started`);
//         console.log(`Running app: `, appInfo);
        
//         npmCmd.stdout.on('data', data => {
//             console.log(`stdout: ${data}`);
            
//             // Emit as output
//             socket.emit("out", {
//                 app: appInfo,
//                 message: data,
//             });
//         });
        
//         npmCmd.stdout.on('end', (msg: any) => {
//             console.log(`stdout: end`, msg);
//         });
        
//         npmCmd.stdout.on('error', (msg) => {
//             console.log(`stdout: error`, msg);
//         });
        
//         // Stderr
//         npmCmd.stderr.on('data', data => {
//             console.log(`stderr: ${data}`);
            
//             // Emit as output
//             socket.emit("out", {
//                 app: appInfo,
//                 message: data,
//             });
//         });
        
//         // Commands are not showing anything on console
//         npmCmd.on('message', (message) => {
//             console.log(`Message event: `, message.toString());
//         });
//         npmCmd.on('exit', (message) => {
//             console.log(`Exit message: `, message?.toString());
//         });
//         npmCmd.on('spawn', (message: any) => {
//             console.log(`Spawn event: `, message);
//         });
//         npmCmd.on('disconnect', (message: any) => {
//             console.log(`Disconnect event: `, message);
//         });
        
//         npmCmd.on('error', (error) => {
//             console.log(`error: ${error.message}`);
            
//             // Emit error
//             socket.emit('app error', error.message);
            
//             // On error disconnect
//             socket.disconnect();
//         });
        
//         npmCmd.on("close", code => {
//             console.log(`child process exited with code ${code}`);
            
//             // Disconnect
//             socket.disconnect();
//         });
//     } catch(err) {
//         console.log(`Running app failed, app: `, appInfo);
//         console.error(err);
//     }
// }

/**
 * Socket io CLI
 */
export default function socketioCli(io: Server) {
    // Connection
    io.on('connection', (socket) => {
        console.log(`A user connected`);
        
        // Run app in dev mode
        socket.on('run', (appInfo: AppInfo) => {
            const appCmd = new AppCmd(appInfo, socket);
            appCmd.run();
        });
    });
}

