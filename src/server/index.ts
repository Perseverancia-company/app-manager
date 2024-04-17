import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";

import mainRouter from "../routes";
import socketioCli from "./socketIoCli";

/**
 * Run server
 */
export default function runServer() {
    const app = express();
    const server = createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3003",
        },
    });
    socketioCli(io);
    
    app.use(express.json());
    app.use(cors({
        origin: "http://localhost:3003",
    }));
    
    // Routes
    app.use(mainRouter);
    
    let defaultPort = 24000;
    let port = defaultPort;
    if(process.env.PORT) {
        const envPort = parseInt(process.env.PORT);
        console.log(`Env port: ${envPort}`);
        port = envPort;
    }
    
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
