import express from "express";

import appsRouter from "./apps";
import appRouter from "./app";
import processRouter from "./process";

/**
 * Main router
 */
export default function mainRouter() {
	const router = express.Router();
	
	router.use("/apps", appsRouter);
	router.use("/app", appRouter);
	router.use("/process", processRouter);
	router.get("/😂", (req, res) => {
		console.log(`[GET] /😂`);
		console.log(`Why so serious? 😂`);
		console.log(`It doesn't works 😭`);
		
		return res.status(200).json({
			messages: [{
				error: false,
				message: "😂"
			}]
		});
	});
	
	return router;
}
