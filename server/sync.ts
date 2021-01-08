import fs from "fs";
import path from "path";
import { DocsCollection } from "/imports/db/docs";

function getPublicDir() {
    if (!process.env.PWD) {
        throw "PWD not found";
    }
    return path.join(process.env.PWD, "public");
}

function sync() {
    console.log("syncing...");
    const docsDir = path.join(getPublicDir(), "docs");
    const expectedDocs = new Set(fs.readdirSync(docsDir));
    const actualDocs = new Set(
        DocsCollection.find()
            .fetch()
            .map((d) => d.name)
    );

    const extra = difference(actualDocs, expectedDocs);
    for (let item of extra) {
        console.log(`Removing extra doc: ${item}`);
        DocsCollection.remove({ name: item });
    }

    const missing = difference(expectedDocs, actualDocs);
    for (let item of missing) {
        console.log(`Adding missing doc: ${item}`);
        DocsCollection.insert({ name: item });
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

export default sync;
