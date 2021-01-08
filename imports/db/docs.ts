import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

export interface Doc {
    _id?: string;
    name: string;
}
const DocsCollection = new Mongo.Collection<Doc>("docs");
if (Meteor.isServer) {
    DocsCollection.rawCollection().createIndex({ name: 1 }, { unique: true });
}

export { DocsCollection };
