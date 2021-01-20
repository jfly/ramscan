import path from "path";

function getProjectRootDir() {
    if (!process.env.PWD) {
        throw "PWD not found";
    }
    return process.env.PWD;
}

function getUploadsDir() {
    return path.join(getProjectRootDir(), "uploads");
}

export { getProjectRootDir, getUploadsDir };
