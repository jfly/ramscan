import { Meteor } from "meteor/meteor";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { paths } from "./Routes";
import { LastPage } from "/imports/types/book";
import { useBooks } from "/imports/ui/hooks";

const Books = () => {
    const books = useBooks();

    function handleAddBook() {
        const bookName = prompt("What is the name of your new book?");
        if (bookName) {
            Meteor.call("books.add", bookName);
        }
    }

    return (
        <ul>
            {books.map((bookName) => (
                <li key={bookName}>
                    <Link to={paths.book(bookName, LastPage)}>{bookName}</Link>
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
