import { Meteor } from "meteor/meteor";
import { FilesCollection } from "/imports/db/files";
import { useTracker } from "meteor/react-meteor-data";
import Book from "/imports/types/book";

function useBook(name: string) {
    const files = useTracker(() => {
        Meteor.subscribe("files/book", { bookName: name });
        return FilesCollection.find({ parent: `/books/${name}` }).fetch();
    });
    return new Book(name, files);
}

export { useBook };
