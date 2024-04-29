/**
 * This router is for projects at: "~/Repositories/Javascript"
 */
import express from "express";
import AppData from "../../../../apps/AppData";
import { projectsPath } from "../../../../apps/Apps";

const javascriptRouter = express.Router();

javascriptRouter.get("/", async (req, res) => {
    const debug = false;
    
    try {
        // Read apps and get their information
        const {
            name 
        } = req.query;
        
        if(debug) {
            console.log(`\n[GET] /app/repository/javascript?name=${name}`);
        }
        
        const appPath = `${projectsPath()}/${name}`;
        
        if(debug) {
            console.log(`App path: ${appPath}`);
        }
        
        const app = new AppData(appPath);
        
        if(debug) {
            console.log(`App name: `, app.name);
        }
        
        await app.fetchAppRunningProcessData();
        
        if(debug) {
            console.log(`Running process data fetch`);
        }
        
        const body = {
            app,
            messages: [{
                error: false,
                message: "Ok"
            }]
        };
        
        if(debug) {
            console.log(`Response body: `, body);
        }
        
        return res.status(200)
            .send(body);
    } catch(err: any) {
        if(debug) {
            console.log(`There was an error when trying to fetch repository data`);
            console.log(`Error:`);
        }
        console.error(err);
        
        return res.status(500).json({
            messages: [{
                error: true,
                message: err.message,
            }]
        });
    }
});

export default javascriptRouter;

