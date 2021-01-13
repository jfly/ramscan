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
    const absPageNumber = page.absPageNumber;

    let backText;
    let handleBack;
    if (absPageNumber == 1) {
        backText = "";
        handleBack = null;
    } else {
        backText = "Prev page";
        handleBack = () =>
            history.push(paths.book(book.name, absPageNumber - 1));
    }
    let nextText;
    let handleNext;
    if (absPageNumber == book.pages.length) {
        nextText = "Scan new page";
        handleNext = () => {}; // <<< TODO
    } else {
        nextText = "Next page";
        handleNext = () =>
            history.push(paths.book(book.name, absPageNumber + 1));
    }

    let upText = "Delete";
    let handleUp = () => {};

    return (
        <Swipeable
            leftText={nextText}
            onLeft={handleNext}
            rightText={backText}
            onRight={handleBack}
            upText={upText}
            onUp={handleUp}
            key={
                absPageNumber
            } /* Force the animation to stop when the image changes */
        >
            <img src={page.imgPath} />
        </Swipeable>
    );
}

export default PagePage;
