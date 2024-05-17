import { Models } from "felixriddle.ts-app-models";

/**
 * App output
 */
export default interface AppOutput {
    id: number;
    appName: string;
    output: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Delete all processes output
 */
export function deleteAllProcessesOutput() {
    const AppOutput = new Models().appOutput;
    
    return new Promise((resolve, reject) => {
        AppOutput.destroy({
            where: {},
            truncate: true
        }).then(() => {
            resolve(true);
        }).catch((err: any) => {
            reject(err);
        });
    });
}
