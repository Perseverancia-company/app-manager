import express from "express";
import { Models } from "felixriddle.ts-app-models";

const processRouter = express.Router();

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
        console.log(`POST /process`);
        
        const {
            name,
            pid,
            appType,
            url,
        } = req.body;
        
        // Insert / update model
        const model = new Models();
        const Process = model.process();
        
            // // Name like 'authentication' or 'real-estate'
            // name: {
            //     type: DataTypes.STRING(128),
            //     allowNull: false,
            //     primaryKey: true,
            // },
            // pid: {
            //     type: DataTypes.INTEGER,
            // },
            // // URL if it's a server
            // url: {
            //     type: DataTypes.STRING(256),
            // },
            // // App type
            // // 1) application
            // // Normal app, for end users
            // // 2) server
            // // A backend server
            // // 3) frontend
            // // A frontend server
            // // 4) daemon
            // appType: {
            //     type: DataTypes.STRING(64),
            //     allowNull: false,
            //     defaultValue: "server",
            // }
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

export default processRouter;
