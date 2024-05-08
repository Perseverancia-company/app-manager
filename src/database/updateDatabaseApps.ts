import path from "path";
import fs from "node:fs";

import { Models } from "felixriddle.ts-app-models";
import { projectsPath } from "../apps/Apps";
import { upsert } from "../routes/process";

/**
 * Updates apps in the database
 * 
 * Insert or update app entries in the database
 */
export default function updateDatabaseApps() {
    // Read directory
    const appsDir = projectsPath();
    const apps = fs.readdirSync(appsDir);
    
    console.log(`Apps discovered: `, apps);
    console.log(`Updating apps in the database`);
    
    // Insert / update model
    const model = new Models();
    const App = model.app;
    
    // Update apps
    return apps.map(async (appName) => {
        const appPath = path.join(appsDir, appName);
        
        // const packageJsonPath = path.join(appPath, "package.json");
        // const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
        
        return await upsert(
            // Model
            App,
            // Update / Insert
            {
                name: appName,
                path: appPath,
            },
            // Where clause
            {
                name: appName
            }
        );
    });
}
