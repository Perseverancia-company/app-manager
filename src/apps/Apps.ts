import os from "os";
import fs from "fs";

/**
 * Projects path
 */
export function projectsPath() {
    return `${os.homedir()}/Repositories/Javascript`;
}

/**
 * Read apps located at a path
 */
export default class Apps {
    path: string;
    apps: Array<String>;
    
    /**
     * 
     * @param options 
     */
    constructor(options = {
        path: projectsPath(),
    }) {
        this.path = options.path ? options.path : projectsPath();
        const folders = fs.readdirSync(options.path);
        console.log(`Folders: `, folders);
        this.apps = folders;
    }
}
