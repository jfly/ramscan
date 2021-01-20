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
    const newChildUploadPaths = new Set(
        fs
            .readdirSync(path.join(root, directory))
            .map((child) => path.join(directory, child))
    );
    for (const childUploadPath of newChildUploadPaths) {
        if (fs.lstatSync(path.join(root, childUploadPath)).isDirectory()) {
            syncDirectory(root, childUploadPath);
        }
    }

    const oldChildUploadPaths = new Set(
        FilesCollection.find({ parent: directory })
            .fetch()
            .map((f) => f.uploadPath)
    );

    const extra = difference(oldChildUploadPaths, newChildUploadPaths);
    for (let path of extra) {
        console.log(`Removing extra file: ${path}`);
        FilesCollection.remove({ uploadPath: path });
    }
    const missing = difference(newChildUploadPaths, oldChildUploadPaths);
    for (let path of missing) {
        console.log(`Adding missing file: ${path}`);
        FilesCollection.insert({
            parent: directory,
            uploadPath: path,
        });
    }
}

// Copied from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
function difference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    let diff = new Set<T>(setA);
    for (let elem of setB) {
        diff.delete(elem);
    }
    return diff;
}

export { syncForever };
