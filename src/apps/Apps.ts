import os from "os";
import fs from "fs";

/**
 * Projects path
 */
export function projectsPath() {
    return `${os.homedir()}/Repositories/Javascript`;
}

export interface AppsOptions {
    path: string;
}

/**
 * Read apps located at a path
 */
export default class Apps {
    options: AppsOptions;
    path: string;
    apps: Array<String> = [];
    
    /**
     * 
     * @param options 
     */
    constructor(query = "", options = {
        path: projectsPath(),
    }) {
        this.options = options;
        this.path = this.options.path ? this.options.path : projectsPath();
        
        if(query) {
            this.includes(query);
        } else {
            this.all();
        }
    }
    
    /**
     * 
     * @param query 
     */
    includes(query: string) {
        const folders = fs.readdirSync(this.options.path);
        this.apps = folders.filter(folder => folder.includes(query));
    }
    
    /**
     * 
     */
    all() {
        const folders = fs.readdirSync(this.options.path);
        this.apps = folders;
    }
}
