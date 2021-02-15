import React from "react";
import { NavLink, Link as RRLink } from "react-router-dom";
import { Breadcrumbs, Link } from "@material-ui/core";
import { paths } from "./Routes";
import { Page, LastPage } from "/imports/types/book";

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
                {page && <PageLink page={page} />}
            </Breadcrumbs>
        </div>
    );
}

type PageLinkProps = {
    page: Page;
};
function PageLink({ page }: PageLinkProps) {
    const bookName = page.book.name;
    return (
        <>
            <Link
                component={NavLink}
                exact
                to={paths.book(bookName, page.pageNumber)}
                color="textPrimary"
            >
                {page.pageNumber}
            </Link>{" "}
            {page.pageNumber == LastPage ? (
                <span>({page.name})</span>
            ) : (
                <span>
                    (
                    <RRLink to={paths.book(bookName, LastPage)}>
                        go to last page
                    </RRLink>
                    )
                </span>
            )}
        </>
    );
}

export default Nav;
