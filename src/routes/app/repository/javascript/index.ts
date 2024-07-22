/**
 * This router is for projects at: "~/Repositories/Javascript"
 */
import express from "express";
import AppData from "../../../../apps/AppData";
import { projectsPath } from "../../../../apps/Apps";
import { Models } from "felixriddle.ts-app-models";

const javascriptRouter = express.Router();

/**
 * Get app by name
 * 
 * The app is fetched on the database and the path retrieved is used to fetch app data
 */
javascriptRouter.get("/name", async (req, res) => {
    const debug = false;
    
    try {
        const {
            name 
        } = req.query;
        
        // console.log(`\n[GET] /app/repository/javascript/name?name=${name}`);
        
        // Get app on the database
        const Apps = new Models().app;
        const dbAppData = await Apps.findOne({
            where: {
                name
            },
        });
        
        const appPath = dbAppData.path;
        
        // Get app data
        const app = new AppData(appPath);
        // Also get the app state
        await app.fetchAppRunningProcessData();
        await app.fetchAppOutput();
        
        const body = {
            app,
            messages: [{
                error: false,
                message: "Ok"
            }]
        };
        
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

/**
 * Get app by folder name
 */
javascriptRouter.get("/folder", async (req, res) => {
    try {
        // Read apps and get their information
        const {
            name 
        } = req.query;
        
        const appPath = `${projectsPath()}/${name}`;
        
        // Create object and fetch its data
        const app = new AppData(appPath);
        await app.fetchAppRunningProcessData();
        await app.fetchAppOutput();
        
        const body = {
            app,
            messages: [{
                error: false,
                message: "Ok"
            }]
        };
        
        return res.status(200)
            .send(body);
    } catch(err: any) {
		console.log(`There was an error when trying to fetch repository data`);
		console.log(`Error:`);
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

