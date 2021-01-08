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

    function handleAddBook() {
        const bookName = prompt("What is the name of your new book?");
        if (bookName) {
            Meteor.call("books.add", bookName);
        }
    }

    return (
        <ul>
            {books.map((book) => (
                <li key={book._id}>
                    <Link to={`/book/${book.name}`}>{book.name}</Link>
                </li>
            ))}
            <li>
                <button onClick={handleAddBook}>Add new book</button>
            </li>
        </ul>
    );
};

const Home = () => {
    return <Books />;
};

export default Home;
