/**
 * List apps in ~/Repositories/Javascript
 */
import express from 'express';
import Apps from '../../apps/Apps';

const appsRouter = express.Router();

appsRouter.get('/', (req, res) => {
    try {
        console.log(`[GET] /apps`);
        // Read apps and get their information
        
        const apps = new Apps();
        return res.status(200)
            .json({
                ...apps,
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

export default appsRouter;

