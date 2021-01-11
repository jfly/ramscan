import { Meteor } from "meteor/meteor";
import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { FilesCollection } from "/imports/db/files";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { paths } from "./Routes";
import { LastPage } from "/imports/types/book";

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
                    <Link to={paths.book(book.name, LastPage)}>
                        {book.name}
                    </Link>
                </li>
            ))}
            <li>
                <Button onClick={handleAddBook} color="primary">
                    Add new book
                </Button>
            </li>
        </ul>
    );
};

const Home = () => {
    return <Books />;
};

export default Home;
