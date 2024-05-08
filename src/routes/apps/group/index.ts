import express from "express";

const groupRouter = express.Router();

groupRouter.post("/create", (req, res) => {
    try {
        console.log(`POST /apps/group/create`);
        console.log(`Body: `, req.body);
        
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
