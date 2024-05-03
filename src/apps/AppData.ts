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
        if(!this.packageJson) {
            // Forget it
            console.log(`No package json`);
            return;
        }
        
        const location = `http://localhost:${process.env.PORT}`;
        console.log(`Location: `, location);
        
        const endpoint = `/app/run_info`;
        console.log(`Endpoint: `, endpoint);
        
        const query = `?app_name=${this.packageJson.name}`;
        console.log(`Query: `, query);
        
        const url = `${location}${endpoint}${query}`;
        console.log(`Url: `, url);
        
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
            const filePath = fs.readFileSync(`${this.path}/package.json`, 'utf8');
            console.log(`Package json path: `, filePath);
            
            this.packageJson = JSON.parse(filePath);
        } catch(err: any) {
            // Yes yes it may not exist, I don't need the console to throw a big ass error every time
            console.log(`The app '${this.name}' doesn't contains a package.json`);
        }
    }
}
