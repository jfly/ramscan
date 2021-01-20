import React from "react";
import { Meteor } from "meteor/meteor";
import { useHistory } from "react-router-dom";
import { PageNumber } from "/imports/types/book";
import { useBook } from "/imports/ui/hooks";
import Nav from "./Nav";
import { paths } from "./Routes";
import { Page } from "/imports/types/book";
import Swipeable from "./Swipeable";
import Progress from "./Progress";

type PagePageProps = {
    bookName: string;
    pageNumber: PageNumber;
};
function PagePage({ bookName, pageNumber }: PagePageProps) {
    const book = useBook(bookName);
    return (
        <>
            <Nav bookName={bookName} pageNumber={pageNumber} />
            {book.pages.length == 0 ? (
                "No pages scanned yet!"
            ) : (
                <PageWithNavigation
                    key={pageNumber}
                    page={book.getPage(pageNumber)}
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
        } else {
            nextEl = <img src={nextPage.imgPath} />;
        }
    } else {
        handleNext = () => {
            Meteor.call("scan", page.book.name, page.absPageNumber + 1);
        };
        nextEl = <div className="scanMessage">Scan new page</div>;
    }

    let upEl = <div className="deleteMessage">Delete</div>;
    let handleUp = () => {};

    return (
        <Swipeable
            prevEl={prevEl}
            onPrev={handleBack}
            nextEl={nextEl}
            onNext={handleNext}
            upEl={upEl}
            onUp={handleUp}
        >
            <img src={page.imgPath} />
        </Swipeable>
    );
}

export default PagePage;
