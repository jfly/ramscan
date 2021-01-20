import { Meteor } from "meteor/meteor";
import path from "path";
import { ScansCollection } from "/imports/db/scans";
import { bookFolder } from "/imports/types/book";
import { getProjectRootDir, getPublicDir } from "./util";
import { spawn } from "child_process";

// Copied from https://stackoverflow.com/a/39914235/1739415
function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getScriptsDir() {
    return path.join(getProjectRootDir(), "scripts");
}

function scanFile(scanId: string, absoluteFilePath: string): Promise<void> {
    const scanScript = path.join(getScriptsDir(), "scan.sh");

    const scan = spawn(scanScript, [absoluteFilePath]);

    return new Promise((resolve, reject) => {
        scan.stdout.on("data", (data) => {
            console.log(`stdout: ${data}`);
        });

        scan.stderr.on("data", (data) => {
            console.error(`stderr: ${data}`);
        });

        scan.on("close", (code) => {
            console.log(`child process exited with code ${code}`);
            if (code == 0) {
                resolve();
            } else {
                reject();
            }
        });

        //<<< for (let i = 0; i < 10; i++) {
        //<<<     await sleep(100);
        //<<<     const progress = (i + 1) / 10;
        //<<<     ScansCollection.update({ _id: scanId }, { $set: { progress } });
        //<<< }
    });
}

Meteor.methods({
    async scan(bookName: string, pageNumber: number) {
        // TODO: validate bookname and pageNumber
        const parent = bookFolder(bookName);
        const publicPath = path.join(parent, `${pageNumber}.jpeg`);
        const absoluteFilePath = path.join(getPublicDir(), publicPath);
        ScansCollection.remove({ publicPath });
        const scanId = ScansCollection.insert({
            parent,
            publicPath,
            progress: 0,
        });
        await scanFile(scanId, absoluteFilePath);
    },
});
