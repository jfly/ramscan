import React from "react";
import { useHistory } from "react-router-dom";
import { PageNumber } from "/imports/types/book";
import { useBook } from "/imports/ui/hooks";
import Nav from "./Nav";
import { paths } from "./Routes";
import { Page } from "/imports/types/book";
import Swipeable from "./Swipeable";

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

    const book = page.book;

    const prevPage = page.prevPage;
    let handleBack, prevEl;
    if (prevPage) {
        handleBack = () =>
            history.push(paths.book(book.name, prevPage.pageNumber));
        prevEl = prevPage && <img className="prevImg" src={prevPage.imgPath} />;
    } else {
        handleBack = null;
        prevEl = null;
    }

    const nextPage = page.nextPage;
    let handleNext, nextEl;
    if (nextPage) {
        handleNext = () =>
            history.push(paths.book(book.name, nextPage.pageNumber));
        nextEl = <img src={nextPage.imgPath} />;
    } else {
        handleNext = () => {}; // <<< TODO
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
