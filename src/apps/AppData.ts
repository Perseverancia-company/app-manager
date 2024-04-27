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
    
    // Redundant but anyways
    isRunning: boolean = false;
    pid: number | undefined;
    url: string = "";
    appType: string = "application";
    
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
     * Fetch app running process data from the database
     */
    async fetchAppRunningProcessData() {
        // Fetch app running information
        const result = await fetch(`http://localhost:${process.env.PORT}/app/run_info?app_name=${this.packageJson.name}`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "GET"
        }).then(async (res) => {
            const data = await res.json();
            return data;
        }).catch((err) => {
            throw new Error(err);
        });
        
        this.isRunning = result.isRunning;
        this.pid = result.pid;
        this.url = result.url;
        this.appType = result.appType;
        
        return result;
    }
    
    /**
     * Load package json
     */
    loadPackageJson() {
        this.packageJson = JSON.parse(fs.readFileSync(`${this.path}/package.json`, "utf8"));
    }
}
