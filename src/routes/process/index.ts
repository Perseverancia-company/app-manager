import express from "express";
import { Models } from "felixriddle.ts-app-models";

const processRouter = express.Router();

export interface Process {
    name: string;
    pid: number;
    url: string;
    appType: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Upsert a model
 * 
 * @param Model 
 * @param values 
 * @param condition 
 * @returns 
 */
export function upsert(Model: any, values: any, condition: object) {
    return Model
        .findOne({ where: condition })
        .then(function(obj: any) {
            // Update
            if(obj) {
                return obj.update(values);
            }
            
            // Insert
            return Model.create(values);
        })
}

processRouter.post('/', async (req, res) => {
    try {
        console.log(`[POST] /process`);
        console.log(`App info: `, req.body);
        
        const {
            name,
            pid,
            appType,
            url,
        } = req.body;
        
        // Insert / update model
        const model = new Models();
        const Process = model.process();
        
        // Upsert model
        await upsert(Process, {
            name,
            pid,
            appType,
            url,
        }, {
            name,
        });
        
        return res
            .status(200)
            .json({
                messages: [{
                    error: false,
                    message: "Ok"
                }]
            });
    } catch(err: any) {
        console.error(err);
        return res.status(500).json({
            messages: [{
                error: true,
                message: err.message,
            }]
        });
    }
});

processRouter.get("/all", async (req, res) => {
    try {
        console.log(`[GET] /process/all`);
        
        // Insert / update model
        const model = new Models();
        const Process = model.process();
        
        const processes = await Process.findAll();
        
        return res
            .status(200)
            .json({
                processes,
                messages: [{
                    error: false,
                    message: "Ok"
                }]
            });
    } catch(err: any) {
        console.error(err);
        return res.status(500).json({
            messages: [{
                error: true,
                message: err.message,
            }]
        });
    }
});

export default processRouter;
