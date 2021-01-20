import { Meteor } from "meteor/meteor";
import { FilesCollection } from "/imports/db/files";
import { ScansCollection } from "/imports/db/scans";
import { BOOKS_FOLDER, bookFolder } from "/imports/types/book";

Meteor.publish("files/books", function () {
    return FilesCollection.find({ parent: BOOKS_FOLDER });
});

Meteor.publish("files/book", function ({ bookName }: { bookName: string }) {
    return FilesCollection.find({ parent: bookFolder(bookName) });
});

Meteor.publish("files/scans", function ({ bookName }: { bookName: string }) {
    return ScansCollection.find({
        parent: bookFolder(bookName),
        progress: { $ne: 1 },
    });
});
