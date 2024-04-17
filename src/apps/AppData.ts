import fs from "fs";

/**
 * App data
 * 
 * Features
 * - Fetches app package json
 */
export default class AppData {
    path: string;
    packageJson: any;
    name: string;
    
    /**
     * 
     * @param path 
     */
    constructor(path: string) {
        this.path = path;
        this.loadPackageJson();
        
        // Get app name
        const name = this.path.split("/").pop();
        if(!name) {
            throw new Error("Couldn't fetch app name from the path");
        }
        this.name = name;
    }
    
    /**
     * Load package json
     */
    loadPackageJson() {
        this.packageJson = JSON.parse(fs.readFileSync(`${this.path}/package.json`, "utf8"));
    }
}
