/**
 * List apps in ~/Repositories/Javascript
 */
import express from 'express';

const appsRouter = express.Router();

appsRouter.get('/', (req, res) => {
    try {
        // Read apps and get their information
        
        // const apps = 
        return res.send(200)
            .json({
                // apps
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
})

