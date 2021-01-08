import { Meteor } from "meteor/meteor";
import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { FilesCollection } from "/imports/db/files";
import { Link } from "react-router-dom";

const Books = () => {
    const files = useTracker(() => {
        Meteor.subscribe("files/books");
        return FilesCollection.find({ parent: "/books" }).fetch();
    });

    const books = files.map((file) => {
        return {
            _id: file._id,
            // Extract just the filename by removing the parent directory from
            // the full path.
            name: file.publicPath.substring((file.parent + "/").length),
        };
    });

    return (
        <ul>
            {books.map((book) => (
                <li key={book._id}>
                    <Link to={`/book/${book.name}`}>{book.name}</Link>
                </li>
            ))}
        </ul>
    );
};

const Home = () => {
    return <Books />;
};

export default Home;
