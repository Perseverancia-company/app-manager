import { Models } from "felixriddle.ts-app-models";
import { Op } from "sequelize";

/**
 * Set pids to null
 * 
 * Always call this function on startup, and only then start apps through app manager.
 * 
 * To correctly track which are running and which aren't
 */
export default async function resetPids() {
    // Insert / update model
    const model = new Models();
    const Process = model.process();
    
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
