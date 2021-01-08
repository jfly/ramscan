import { Meteor } from "meteor/meteor";
import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { FilesCollection } from "/imports/db/files";

type BookProps = {
    name: string;
};
const Book = ({ name }: BookProps) => {
    const files = useTracker(() => {
        Meteor.subscribe("files/book", { bookName: name });
        return FilesCollection.find({ parent: `/books/${name}` }).fetch();
    });

    return (
        <ul>
            {files.map((file) => (
                <img key={file._id} src={file.publicPath} />
            ))}
        </ul>
    );
};

export default Book;
