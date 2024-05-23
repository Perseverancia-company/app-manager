import express from 'express';
import App from '../../app/cmd/App';
import { AppInfo } from '../../server/socketIoCli';

const runAppRouter = express.Router();

runAppRouter.post('/', (req, res) => {
    try {
        console.log(`[GET] /app/run`);
        
        const appInfo: AppInfo = req.body;
        
        const app = new App(appInfo.path);
        
        // It's async we can't await for it either
        // because this request should just run and be on its way.
        app.run(appInfo.command);
        
        return res.status(200).send({
            messages: [{
                error: false,
                message: "Ok"
            }]
        });
    } catch(err: any) {
        console.error(err);
        return res.status(500).send({
            messages: [{
                error: true,
                message: err.message,
            }]
        });
    }
});

export default runAppRouter;

