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
    
    /**
     * 
     * @param path 
     */
    constructor(path: string) {
        this.path = path;
        this.loadPackageJson();
    }
    
    /**
     * Load package json
     */
    loadPackageJson() {
        this.packageJson = JSON.parse(fs.readFileSync(`${this.path}/package.json`, "utf8"));
    }
}
