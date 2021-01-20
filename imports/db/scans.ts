import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

export interface Scan {
    _id?: string;
    parent: string;
    uploadPath: string;
    progress: number;
}
const ScansCollection = new Mongo.Collection<Scan>("scans");
if (Meteor.isServer) {
    ScansCollection.rawCollection().createIndex({ parent: 1 });
    ScansCollection.rawCollection().createIndex(
        { uploadPath: 1 },
        { unique: true }
    );
}

export { ScansCollection };
