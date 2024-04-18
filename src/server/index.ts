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
    // Show colors when sending data to the frontend or for any other reason
    process.env.FORCE_COLOR = 'true';
    process.env.PORT = process.env.PORT || "24000";
    
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
    
    const port = process.env.PORT;
    if(!port) {
        throw Error("Impossible, the port was just set!");
    }
    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
