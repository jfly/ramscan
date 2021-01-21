import { Meteor } from "meteor/meteor";
import path from "path";
import { ScansCollection } from "/imports/db/scans";
import { FilesCollection } from "/imports/db/files";
import { CurrentBooksCollection } from "/imports/db/currentBooks";
import Book, { bookFolder } from "/imports/types/book";
import { getProjectRootDir, getUploadsDir } from "./util";
import { spawn } from "child_process";

function getScriptsDir() {
    return path.join(getProjectRootDir(), "scripts");
}

const PROGRESS_RE = /Progress: (?<progress>[0-9]+(.[0-9]+)?)%/;

function scanFile(bookName: string, pageNumber: number): Promise<void> {
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

    const scanScript = path.join(getScriptsDir(), "scan.sh");

    const scan = spawn(scanScript, [absoluteFilePath]);

    return new Promise((resolve, reject) => {
        const onData = function (prefix: string) {
            return Meteor.bindEnvironment(function (data: Buffer) {
                // The incoming data might be something like: "Progress:
                // 5%\rProgress: 6%". If so, just ignore all but the last
                // progress update.
                const dataStrs = data
                    .toString("utf8")
                    .split("\r")
                    .filter((line) => line.length > 0);
                const dataStr = dataStrs[dataStrs.length - 1];
                const match = PROGRESS_RE.exec(dataStr);
                if (match && match.groups) {
                    const progress = parseFloat(
                        match.groups.progress.substring(0, dataStr.length - 1)
                    );
                    ScansCollection.update(
                        { _id: scanId },
                        { $set: { progress } }
                    );
                } else {
                    console.log(`${prefix}: ${JSON.stringify(dataStrs)}`);
                }
            });
        };

        scan.stdout.on("data", onData("stdout"));
        scan.stderr.on("data", onData("stderr"));

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

function getBook(name: string) {
    const files = FilesCollection.find({
        parent: bookFolder(name),
    }).fetch();
    const scans = ScansCollection.find({
        parent: bookFolder(name),
    }).fetch();
    return new Book(name, files, scans);
}

async function scanCurrentBook() {
    const current = CurrentBooksCollection.findOne();
    if (!current || !current.bookName) {
        throw new Error("No book currently selected");
    }
    const name = current.bookName;
    const currentBook = getBook(name);
    await scanFile(name, currentBook.pages.length + 1);
}

Meteor.methods({
    async scan(bookName: string, pageNumber: number) {
        await scanFile(bookName, pageNumber);
    },
    makeCurrent(bookName: string) {
        CurrentBooksCollection.upsert({}, { bookName });
    },
});

export { scanCurrentBook };
