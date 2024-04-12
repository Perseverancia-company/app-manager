/**
 * Get / Set app information
 */
import express from 'express';
import AppData from '../../apps/AppData';

const appsRouter = express.Router();

appsRouter.get('/', (req, res) => {
    try {
        // Read apps and get their information
        const {
            path 
        } = req.body;
        
        const app = new AppData(path);
        return res.send(200)
            .json({
                app,
                messages: [{
                    error: false,
                    message: "Ok"
                }]
            });
    } catch(err) {
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

