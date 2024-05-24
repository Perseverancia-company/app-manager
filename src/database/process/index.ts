
/**
 * Remove app pid from the database
 */
export default async function removeAppPid(appName: string, Process: any) {
    // Remove pid from the database
    const processInfo = await Process.findOne({
        where: {
            name: appName
        }
    });
    
    processInfo.pid = null;
    await processInfo.save();
}
