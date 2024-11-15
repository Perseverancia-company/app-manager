import { Models } from "felixriddle.ts-app-models";
import { Op } from "sequelize";

/**
 * Set pids to null
 * 
 * Always call this function on startup, and only then start apps through app manager.
 * 
 * To correctly track which are running and which aren't
 */
export default async function resetPids(models: Models) {
    // Insert / update model
    const { Process } = models;
    
    // Null all pids
    return await Process.update({
        pid: null
    }, {
        where: {
            pid: {
                // Wherever the operator is not equal to null
                [Op.ne]: null
            }
        }
    })
}
