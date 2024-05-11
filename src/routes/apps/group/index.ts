import express from "express";

import { Models } from "felixriddle.ts-app-models";

import appsRouter from "./apps";

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

/**
 * Get current page
 */
function getCurrentPage(query: any) {
    const page = query.page;
    
    if(!page) {
        return 1;
    }
    
    return Number(page);
}

/**
 * 
 */
function getPerPage(query: any) {
    const perPage = query.perPage;
    
    if(!perPage) {
        return 5;
    }
    
    return Number(perPage);
}

/**
 * Get app group by id
 */
groupRouter.get("/id", async (req, res) => {
    try {
        // console.log(`[GET] /apps/group`);
        
        // console.log(`Request params: `, req.query);
        
        const { 
            id
        } = req.query;
        
        if(!id) {
            throw Error("No id provided");
        }
        
        // Read apps and get their information
        const AppGroup = new Models().appGroup;
        const appGroup = await AppGroup.findAll({
            where: {
                id,
            }
        });
        
        // console.log(`App group: `, appGroup);
        
        return res.status(200).send({
            group: appGroup,
            messages: [{
                message: "Ok",
                error: false,
            }],
        });
    } catch(err: any) {
        console.error(err);
        
        return res.status(500).send({
            messages: [{
                message: `Error: ${err.message}`,
                error: true,
            }],
        });
    }
});

/**
 * Fetch all groups with pagination
 * 
 * path: /apps/group
 */
groupRouter.get("/", async (req, res) => {
    try {
        console.log(`[GET] /apps/group`);
        
        console.log(`Request params: `, req.query);
        
        // Pagination
        const perPage = getPerPage(req.query);
        const page = getCurrentPage(req.query);
        console.log(`Per page: `, perPage);
        console.log(`Page: `, page);
        
        // Top
        const top = perPage * page;
        const floor = top - perPage;
        console.log(`Top: `, top);
        console.log(`Floor: `, floor);
        
        // Read apps and get their information
        const AppGroup = new Models().appGroup;
        
        const appGroups = await AppGroup.findAll({
            limit: perPage,
            offset: floor,
            // Nice to keep around
            // order: [
            //     ["createdAt", "DESC"]
            // ]
        });
        
        console.log(`App groups: `, appGroups);
        
        return res.status(200).send({
            appGroups,
            messages: [{
                message: "Ok",
                error: false,
            }],
        });
    } catch(err: any) {
        console.error(err);
        
        return res.status(500).send({
            messages: [{
                message: `Error: ${err.message}`,
                error: true,
            }],
        });
    }
});

groupRouter.post("/create", async (req, res) => {
    try {
        console.log(`[POST] /apps/group/create`);
        
        const {
            name,
            description,
            apps
        } = req.body;
        
        const appNames = getAppsNames(apps);
        
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

groupRouter.use("/apps", appsRouter);

export default groupRouter;
