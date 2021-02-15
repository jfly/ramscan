import React from "react";
import { Meteor } from "meteor/meteor";
import { useHistory } from "react-router-dom";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import { PageNumber } from "/imports/types/book";
import { useBook, useCurrentBook } from "/imports/ui/hooks";
import Nav from "./Nav";
import { paths } from "./Routes";
import { Page, LastPage } from "/imports/types/book";
import Swipeable from "./Swipeable";
import Progress from "./Progress";

type PagePageProps = {
    bookName: string;
    pageNumber: PageNumber;
};
function PagePage({ bookName, pageNumber }: PagePageProps) {
    const book = useBook(bookName);
    const page = book.pages.length == 0 ? null : book.getPage(pageNumber);
    const currentBookName = useCurrentBook();

    async function handleMakeCurrent() {
        await Meteor.call("makeCurrent", bookName);
    }
    return (
        <>
            <Nav bookName={bookName} page={page} />
            {currentBookName !== bookName && (
                <Alert
                    severity="warning"
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={handleMakeCurrent}
                        >
                            Make current
                        </Button>
                    }
                >
                    {currentBookName ? (
                        <>
                            This is not the current book (scans will go to book{" "}
                            <strong>{currentBookName}</strong> instead)
                        </>
                    ) : (
                        <>There is no current book</>
                    )}
                </Alert>
            )}
            {!page ? (
                "No pages scanned yet!"
            ) : (
                <PageWithNavigation
                    key={pageNumber}
                    page={page}
                ></PageWithNavigation>
            )}
        </>
    );
}

type PageWithNavigationProps = {
    page: Page;
};
function PageWithNavigation({ page }: PageWithNavigationProps) {
    const history = useHistory();

    if (page.isScan) {
        return <Progress value={page.scanProgress} description="Scanning" />;
    }

    const book = page.book;

    const prevPage = page.prevPage;
    let handleBack, prevEl;
    if (prevPage) {
        handleBack = () =>
            history.push(paths.book(book.name, prevPage.pageNumber));
        if (prevPage.isScan) {
            prevEl = <div>A scan is happening over here</div>;
        } else if (prevPage.isMissing) {
            prevEl = <div>This page is missing!</div>;
        } else {
            prevEl = <img className="prevImg" src={prevPage.imgPath} />;
        }
    } else {
        handleBack = null;
        prevEl = null;
    }

    const nextPage = page.nextPage;
    let handleNext, nextEl;
    if (nextPage) {
        handleNext = () =>
            history.push(paths.book(book.name, nextPage.pageNumber));
        if (nextPage.isScan) {
            nextEl = <div>A scan is happening over here</div>;
        } else if (nextPage.isMissing) {
            prevEl = <div>This page is missing!</div>;
        } else {
            nextEl = <img src={nextPage.imgPath} />;
        }
    } else {
        handleNext = () => {
            Meteor.call("scan", page.book.name, page.book.nextPageNumber);
        };
        nextEl = <div className="scanMessage">Scan new page</div>;
    }

    function handleDelete() {
        if (
            confirm(
                "Are you sure you want to delete this page? This cannot be undone."
            )
        ) {
            Meteor.call("deletePage", page.book.name, page.absPageNumber);
        }
    }
    const upEl = (
        <div className="deleteMessage">
            <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleDelete}
                startIcon={<DeleteIcon />}
            >
                Delete
            </Button>
        </div>
    );
    const handleUp = () => {};

    const handleFirst = () => history.push(paths.book(book.name, 1));
    const handleLast = () => history.push(paths.book(book.name, LastPage));

    return (
        <Swipeable
            prevEl={prevEl}
            onPrev={handleBack}
            nextEl={nextEl}
            onNext={handleNext}
            upEl={upEl}
            onUp={handleUp}
            onFirst={handleFirst}
            onLast={handleLast}
        >
            {page.isMissing ? (
                <div>This page is missing!</div>
            ) : (
                <img src={page.imgPath} />
            )}
        </Swipeable>
    );
}

export default PagePage;
