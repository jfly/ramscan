import { Meteor } from "meteor/meteor";
import path from "path";
import { ScansCollection } from "/imports/db/scans";
import { bookFolder } from "/imports/types/book";
import { getProjectRootDir, getUploadsDir } from "./util";
import { spawn } from "child_process";

function getScriptsDir() {
    return path.join(getProjectRootDir(), "scripts");
}

function scanFile(scanId: string, absoluteFilePath: string): Promise<void> {
    const scanScript = path.join(getScriptsDir(), "scan.sh");

    const scan = spawn(scanScript, [absoluteFilePath]);

    return new Promise((resolve, reject) => {
        scan.stdout.on(
            "data",
            Meteor.bindEnvironment((data: Buffer) => {
                const dataStr = data.toString("utf8").trim();
                if (dataStr.endsWith("%")) {
                    const progress = parseInt(
                        dataStr.substring(0, dataStr.length - 1)
                    );
                    ScansCollection.update(
                        { _id: scanId },
                        { $set: { progress } }
                    );
                }
                console.log(`stdout: ${dataStr}`);
            })
        );

        scan.stderr.on("data", (data: Buffer) => {
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
    });
}

Meteor.methods({
    async scan(bookName: string, pageNumber: number) {
        // TODO: validate bookname and pageNumber
        const parent = bookFolder(bookName);
        const uploadPath = path.join(parent, `${pageNumber}.jpeg`);
        const absoluteFilePath = path.join(getUploadsDir(), uploadPath);
        ScansCollection.remove({ uploadPath });
        const scanId = ScansCollection.insert({
            parent,
            uploadPath,
            progress: 0,
        });
        await scanFile(scanId, absoluteFilePath);
    },
});
