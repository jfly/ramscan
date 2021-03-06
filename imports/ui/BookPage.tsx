import React from "react";
import Chip from "@material-ui/core/Chip";
import Nav from "./Nav";
import { useBook } from "./hooks";
import { Link } from "react-router-dom";
import { paths } from "./Routes";
import { LastPage } from "/imports/types/book";

type BookPageProps = {
    name: string;
};
const BookPage = ({ name }: BookPageProps) => {
    const book = useBook(name);
    return (
        <>
            <Nav bookName={book.name} />
            <h1>Book: {book.name}</h1>
            <Link to={paths.book(book.name, LastPage)}>Go to last page</Link>
            <ul>
                {book.pages.map((page) => (
                    <li key={page.pageNumber}>
                        <Link to={paths.book(book.name, page.pageNumber)}>
                            Page {page.pageNumber} ({page.name})
                        </Link>
                        {page.isMissing && (
                            <Chip color="secondary" label="Missing" />
                        )}
                        {page.isScan && (
                            <Chip color="primary" label="Scanning" />
                        )}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default BookPage;
