import path from "path";
import fs from "fs";

function getProjectRootDir() {
    let rootDir;
    if (process.env.RAMSCAN_ROOT) {
        rootDir = process.env.RAMSCAN_ROOT;
    } else {
        if (!process.env.PWD) {
            throw "PWD not found";
        }
        rootDir = process.env.PWD;
    }
    if (!fs.existsSync(rootDir)) {
        throw `Directory ${rootDir} not found`;
    }
    return rootDir;
}

function getUploadsDir() {
    return path.join(getProjectRootDir(), "uploads");
}

function getScriptsDir() {
    return path.join(getProjectRootDir(), "scripts");
}

export { getScriptsDir, getUploadsDir };
