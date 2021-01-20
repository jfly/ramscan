import _ from "lodash";
import path from "path";
import { File } from "/imports/db/files";
import { Scan } from "/imports/db/scans";

const BOOKS_FOLDER = "/books";

function bookFolder(bookName: string) {
    return path.join(BOOKS_FOLDER, bookName);
}

const LastPage = "last";
type PageNumber = number | typeof LastPage;

function parsePageNumber(pageNumberStr: string): PageNumber {
    if (pageNumberStr == LastPage) {
        return LastPage;
    } else {
        return parseInt(pageNumberStr);
    }
}

class Book {
    #name: string;
    #pages: Page[];
    constructor(name: string, files: File[], scans: Scan[]) {
        this.#name = name;

        const fileByName = _.keyBy(files, (file) =>
            path.basename(file.publicPath, ".jpeg")
        );
        const scanByName = _.keyBy(scans, (scan) =>
            path.basename(scan.publicPath, ".jpeg")
        );
        const filenames = [
            ...Object.keys(fileByName),
            ...Object.keys(scanByName),
        ];
        const numbers = filenames
            .map((filename) => parseInt(filename))
            .filter((n) => !isNaN(n));
        const lastPageNumber = Math.max(...numbers);
        this.#pages = [];
        for (let pageNumber = 1; pageNumber <= lastPageNumber; pageNumber++) {
            if (fileByName[pageNumber]) {
                this.#pages.push(
                    new FilePage(this, pageNumber, fileByName[pageNumber])
                );
            } else if (scanByName[pageNumber]) {
                this.#pages.push(
                    new ScanPage(this, pageNumber, scanByName[pageNumber])
                );
            }
        }
    }

    get name() {
        return this.#name;
    }

    get pages(): Page[] {
        return this.#pages;
    }

    getAbsolutePageNumber(pageNumber: PageNumber): number {
        return pageNumber == LastPage ? this.#pages.length : pageNumber;
    }

    getPage(pageNumber: PageNumber): Page {
        const absPageNumber = this.getAbsolutePageNumber(pageNumber);
        const index = absPageNumber - 1;
        if (index < 0 || index >= this.#pages.length) {
            throw `Invalid pageNumber: ${pageNumber}`;
        }
        return this.#pages[index];
    }
}

class BasePage {
    #book: Book;
    #pageNumber: PageNumber;
    #publicPath: string;
    #parent: string;

    constructor(
        book: Book,
        pageNumber: PageNumber,
        publicPath: string,
        parent: string
    ) {
        this.#book = book;
        this.#pageNumber = pageNumber;
        this.#publicPath = publicPath;
        this.#parent = parent;
    }

    get book() {
        return this.#book;
    }

    get pageNumber() {
        return this.#pageNumber;
    }

    get absPageNumber() {
        return this.book.getAbsolutePageNumber(this.#pageNumber);
    }

    private offsetPage(offset: number) {
        const absPageNumber = this.absPageNumber + offset;
        if (absPageNumber <= 0 || absPageNumber > this.#book.pages.length) {
            return null;
        }
        return this.#book.getPage(absPageNumber);
    }

    get nextPage() {
        return this.offsetPage(+1);
    }

    get prevPage() {
        return this.offsetPage(-1);
    }

    get name() {
        return this.#publicPath.substring((this.#parent + "/").length);
    }
}

class ScanPage extends BasePage {
    #scan: Scan;
    isScan: true;

    constructor(book: Book, pageNumber: PageNumber, scan: Scan) {
        super(book, pageNumber, scan.publicPath, scan.parent);
        this.#scan = scan;
        this.isScan = true;
    }

    get scanProgress() {
        return this.#scan.progress;
    }
}

class FilePage extends BasePage {
    #file: File;
    isScan: false;

    constructor(book: Book, pageNumber: PageNumber, file: File) {
        super(book, pageNumber, file.publicPath, file.parent);
        this.#file = file;
        this.isScan = false;
    }

    get imgPath() {
        return this.#file.publicPath;
    }
}

type Page = ScanPage | FilePage;

export default Book;
export {
    Page,
    PageNumber,
    LastPage,
    parsePageNumber,
    BOOKS_FOLDER,
    bookFolder,
};
