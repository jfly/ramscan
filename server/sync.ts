import _ from "lodash";
import { Meteor } from "meteor/meteor";
import fs from "fs";
import path from "path";
import { FilesCollection } from "/imports/db/files";
import chokidar from "chokidar";
import { getUploadsDir } from "./util";

function syncForever() {
    syncImmediately();
    chokidar
        .watch(getUploadsDir())
        .on("all", _.debounce(Meteor.bindEnvironment(syncImmediately), 100));
}

function syncImmediately() {
    console.log("syncing...");
    syncDirectory(getUploadsDir(), "/");
}

function syncDirectory(root: string, directory: string) {
    console.log(`syncing ${directory}`);
    const newChildUploadPathWithStats = fs
        .readdirSync(path.join(root, directory))
        .map((child) => {
            const uploadPath = path.join(directory, child);
            return {
                uploadPath,
                stat: fs.lstatSync(path.join(root, uploadPath)),
            };
        });
    for (const { uploadPath, stat } of newChildUploadPathWithStats) {
        if (stat.isDirectory()) {
            syncDirectory(root, uploadPath);
        }
    }

    const newChildUploadPaths = newChildUploadPathWithStats.map(function ({
        uploadPath,
        stat,
    }) {
        return {
            uploadPath,
            mtime: stat.mtime.getTime(),
        };
    });
    const oldChildUploadPaths = FilesCollection.find({ parent: directory })
        .fetch()
        .map((f) => {
            return { uploadPath: f.uploadPath, mtime: f.mtime };
        });

    const extra = difference(oldChildUploadPaths, newChildUploadPaths);
    for (let { uploadPath } of extra) {
        console.log(`Removing extra file: ${uploadPath}`);
        FilesCollection.remove({ uploadPath });
    }
    const missing = difference(newChildUploadPaths, oldChildUploadPaths);
    for (let { uploadPath, mtime } of missing) {
        console.log(`Adding missing file: ${uploadPath}`);
        FilesCollection.insert({
            parent: directory,
            uploadPath,
            mtime: mtime,
        });
    }
}

// Jankiness to support setwise diffing of non-primitives. I think this will
// suck less once Javascript has Record/Tuple support.
function difference<T>(arrA: T[], arrB: T[]): T[] {
    const setA = new Set(arrA.map((e) => JSON.stringify(e)));
    const setB = new Set(arrB.map((e) => JSON.stringify(e)));
    const set = setDifference(setA, setB);
    return Array.from(set).map((j) => JSON.parse(j));
}

// Copied from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
function setDifference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    let diff = new Set<T>(setA);
    for (let elem of setB) {
        diff.delete(elem);
    }
    return diff;
}

export { syncForever };
