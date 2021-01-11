import React from "react";
import { NavLink } from "react-router-dom";
import { Breadcrumbs, Link } from "@material-ui/core";
import { paths } from "./Routes";
import { PageNumber } from "/imports/types/book";

type NavProps = {
    bookName: string;
    pageNumber?: PageNumber;
};
function Nav({ bookName, pageNumber }: NavProps) {
    return (
        <div className="nav">
            <Breadcrumbs aria-label="breadcrumb">
                <Link component={NavLink} exact to="/" color="inherit">
                    Books
                </Link>
                <Link
                    component={NavLink}
                    exact
                    to={paths.book(bookName)}
                    color="inherit"
                >
                    {bookName}
                </Link>
                {pageNumber && (
                    <Link
                        component={NavLink}
                        exact
                        to={paths.book(bookName, pageNumber)}
                        color="textPrimary"
                    >
                        {pageNumber}
                    </Link>
                )}
            </Breadcrumbs>
        </div>
    );
}

export default Nav;
