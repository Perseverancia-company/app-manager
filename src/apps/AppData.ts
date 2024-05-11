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
    folderName: string;
    
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
        const folderName = this.path.split("/").pop();
        if(!folderName) {
            throw new Error("Couldn't fetch app folder name from the path");
        }
        this.folderName = folderName;
    }
    
    /**
     * Fetch app running process data from the database
     */
    async fetchAppRunningProcessData() {
        if(!this.packageJson) {
            // Forget it
            console.log(`No package json`);
            return;
        }
        
        const location = `http://localhost:${process.env.PORT}`;
        const endpoint = `/app/run_info`;
        const query = `?app_name=${this.packageJson.name}`;
        const url = `${location}${endpoint}${query}`;
        
        // console.log(`Location: `, location);
        // console.log(`Endpoint: `, endpoint);
        // console.log(`Query: `, query);
        // console.log(`Url: `, url);
        
        // Fetch app running information
        const result = await fetch(url, {
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
        try {
            const packageJson = fs.readFileSync(`${this.path}/package.json`, 'utf8');
            // console.log(`Package json: `, packageJson);
            
            this.packageJson = JSON.parse(packageJson);
        } catch(err: any) {
            // Yes yes it may not exist, I don't need the console to throw a big ass error every time
            console.log(`The app '${this.folderName}' doesn't contain a package.json`);
        }
    }
}
