import path from "path";
import { Meteor } from "meteor/meteor";
import { FilesCollection } from "/imports/db/files";

Meteor.publish("files/books", function () {
    return FilesCollection.find({ parent: "/books" });
});

Meteor.publish("files/book", function ({ bookName }: { bookName: string }) {
    return FilesCollection.find({ parent: path.join("/books", bookName) });
});
