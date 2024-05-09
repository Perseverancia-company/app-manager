import express from "express";
import { Models } from "felixriddle.ts-app-models";

const groupRouter = express.Router();

/**
 * 
 * @param apps 
 * @returns 
 */
export function getAppsNames(apps: any[]): string[] {
    let appNames: string[] = [];
    for(const app of apps) {
        appNames.push(app.packageJson.name);
    }
    
    return appNames;
}

groupRouter.post("/create", async (req, res) => {
    try {
        // console.log(`POST /apps/group/create`);
        // console.log(`Body: `, req.body);
        
        const {
            name,
            description,
            apps
        } = req.body;
        
        // console.log(`Name: `, name);
        // console.log(`Description: `, description);
        // console.log(`Apps: `, apps);
        
        const appNames = getAppsNames(apps);
        // console.log(`App names: `, appNames);
        
        const models = new Models();
        
        // Create group
        const AppGroup = models.appGroup;
        const appGroup = await AppGroup.create({
            name,
            description,
        });
        
        // Create group app junctions
        const GroupAppJunction = models.groupAppJunction;
        const groupId = appGroup.id;
        // console.log(`Group Id: `, groupId);
        
        for(const appName of appNames) {
            await GroupAppJunction.create({
                appName,
                groupId,
            });
        }
        
        return res.status(200).send({
            groupCreated: true,
            messages: [{
                message: "Group created",
                error: false,
            }],
        });
    } catch(err: any) {
        console.error(err);
        
        return res.status(500).send({
            groupCreated: false,
            messages: [{
                message: `Error: ${err.message}`,
                error: true,
            }],
        });
    }
});

export default groupRouter;
