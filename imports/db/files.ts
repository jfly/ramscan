import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

export interface File {
    _id?: string;
    parent: string;
    publicPath: string;
}
const FilesCollection = new Mongo.Collection<File>("files");
if (Meteor.isServer) {
    FilesCollection.rawCollection().createIndex({ parent: 1 });
    FilesCollection.rawCollection().createIndex(
        { publicPath: 1 },
        { unique: true }
    );
}

export { FilesCollection };
