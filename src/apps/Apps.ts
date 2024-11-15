import os from "os";
import fs from "fs";

/**
 * Projects path
 * 
 * WARNING:
 * Snap(Snapcraft) seems to change home directory, install terminal environments from apt instead
 */
export function projectsPath() {
	const homeDirectory = os.homedir();
    return `${homeDirectory}/Repositories/Javascript`;
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
     * Check if an app exists
     * 
     * @param query 
     */
    includes(query: string) {
        const allFolders = fs.readdirSync(this.options.path);
        
        // It must be by name of the package not the folder haha
        
        // Filter folders by those that have package.json
        const folders = allFolders.filter(
			folder => fs.existsSync(`${this.options.path}/${folder}/package.json`)
		);
        
        // Check if the query matches the name of the package
        this.apps = folders.filter(folder => {
            const packagePath = `${this.options.path}/${folder}/package.json`;
            
            // Get package json
            const packageRaw = fs.readFileSync(packagePath, 'utf8');
            const packageA = JSON.parse(packageRaw);
            const packageName = packageA.name;
            
            return packageName.includes(query);
        });
    }
    
    /**
     * Update apps
     */
    all() {
        const allFolders = fs.readdirSync(this.options.path);
        
        // It must be by name of the package not the folder haha
        
        // Filter folders by those that have package.json
        const folders = allFolders.filter(
			folder => fs.existsSync(`${this.options.path}/${folder}/package.json`)
		);
        
        this.apps = folders;

        return folders;
    }
}
