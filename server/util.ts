import path from "path";

function getProjectRootDir() {
    if (!process.env.PWD) {
        throw "PWD not found";
    }
    return process.env.PWD;
}

function getPublicDir() {
    return path.join(getProjectRootDir(), "public");
}

export { getProjectRootDir, getPublicDir };
