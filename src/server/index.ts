import express from "express";

import mainRouter from "../routes";

/**
 * Run server
 */
export default function runServer() {
    const app = express();
    
    app.use(express.json());
    
    // Routes
    app.use(mainRouter)
    
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

