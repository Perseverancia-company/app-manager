import express from "express";
import { Models } from "felixriddle.ts-app-models";

const appsRouter = express.Router();

appsRouter.get("/", async (req, res) => {
    try {
        const {
            groupId
        } = req.query;
        
        // console.log(`[GET] /apps/group/apps?groupId=${groupId}`);
        
        const models = new Models();
        const GroupApp = models.groupAppJunction;
        
        const apps = await GroupApp.findAll({
            where: {
                groupId: Number(groupId)
            }
        });
        
        return res.status(200).send({
            apps,
            messages :[{
                message: "Ok",
                error: false,
            }]
        });
    } catch(err: any) {
        console.error(err);
        return res.status(500).send({
            messages :[{
                message: "Error couldn't find the apps",
                error: true,
            }]
        });
    }
});

export default appsRouter;

