import React from "react";
import { NavLink } from "react-router-dom";
import { Breadcrumbs, Link } from "@material-ui/core";
import { paths } from "./Routes";
import { Page } from "/imports/types/book";

type NavProps = {
    bookName: string;
    page?: Page | null;
};
function Nav({ bookName, page }: NavProps) {
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
                {page && (
                    <Link
                        component={NavLink}
                        exact
                        to={paths.book(bookName, page.pageNumber)}
                        color="textPrimary"
                    >
                        {page.pageNumber} ({!page.isScan && page.fileName})
                    </Link>
                )}
            </Breadcrumbs>
        </div>
    );
}

export default Nav;
