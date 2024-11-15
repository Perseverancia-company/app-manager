import express, { Request } from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import color from "ansi-color";

import mainRouter from "../routes";
import socketioCli from "./socketIoCli";
import { Models } from "felixriddle.ts-app-models";

/**
 * Print method and route
 */
function printRoute(req: Request) {
	switch(req.method) {
		case "POST": {
			const method = color.set(`${req.method}`, "yellow");
			console.log(`${method} ${req.originalUrl}`);
			break;
		}
		case "GET": {
			const method = color.set(`${req.method}`, "green");
			console.log(`${method} ${req.originalUrl}`);
			break;
		}
		case "DELETE": {
			const method = color.set(`${req.method}`, "red");
			console.log(`${method} ${req.originalUrl}`);
			break;
		}
		case "PUT": {
			const method = color.set(`${req.method}`, "blue");
			console.log(`${method} ${req.originalUrl}`);
			break;
		}
		case "PATCH": {
			const method = color.set(`${req.method}`, "magenta");
			console.log(`${method} ${req.originalUrl}`);
			break;
		}
	}
}

/**
 * Run server
 */
export default function runServer(models: Models) {
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
    socketioCli(models, io);
    
    app.use(express.json());
    app.use(cors({
        origin: "http://localhost:3003",
    }));
    
    // Routes
	app.use((req, res, next) => {
		printRoute(req);
		
		return next();
	});
    app.use(mainRouter());
    
    const port = process.env.PORT;
    if(!port) {
        throw Error("Impossible, the port was just set!");
    }
    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
