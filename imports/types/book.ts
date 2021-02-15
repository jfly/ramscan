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
    #pageByNumber: Record<number, Page | null>;
    constructor(name: string, files: File[], scans: Scan[]) {
        this.#name = name;

        const fileByName = _.keyBy(files, (file) =>
            path.basename(file.uploadPath, ".jpeg")
        );
        const scanByName = _.keyBy(scans, (scan) =>
            path.basename(scan.uploadPath, ".jpeg")
        );
        const filenames = [
            ...Object.keys(fileByName),
            ...Object.keys(scanByName),
        ];
        const numbers = filenames
            .map((filename) => parseInt(filename))
            .filter((n) => !isNaN(n));
        const lastPageNumber = Math.max(...numbers);
        this.#pageByNumber = {};
        this.#pages = [];
        let absPageNumber;
        do {
            absPageNumber = this.nextPageNumber;
            let page = null;
            if (fileByName[absPageNumber]) {
                page = new FilePage(
                    this,
                    absPageNumber,
                    fileByName[absPageNumber]
                );
            } else if (scanByName[absPageNumber]) {
                page = new ScanPage(
                    this,
                    absPageNumber,
                    scanByName[absPageNumber]
                );
            } else {
                const uploadPath = path.join(
                    bookFolder(name),
                    `${absPageNumber}.jpeg`
                );
                page = new MissingPage(this, absPageNumber, uploadPath);
            }
            this.#pageByNumber[absPageNumber] = page;
            this.#pages.push(page);
        } while (absPageNumber <= lastPageNumber);
        // Trim any trailing missing pages
        while (true) {
            const lastPage = this.lastPage;
            if (!lastPage || !lastPage.isMissing) {
                break;
            }
            // Remove this trailing missing page.
            const page = this.#pages.pop();
            if (!page) {
                throw "Impossible?";
            }
            delete this.#pageByNumber[page.absPageNumber];
        }
    }

    get name() {
        return this.#name;
    }

    get pages(): Page[] {
        return this.#pages;
    }

    get lastPage(): Page | null {
        return this.#pages.length == 0
            ? null
            : this.#pages[this.#pages.length - 1];
    }

    getRelativePageNumber(pageNumber: number): PageNumber {
        return pageNumber == this.lastPage?.absPageNumber
            ? LastPage
            : pageNumber;
    }

    getAbsolutePageNumber(pageNumber: PageNumber): number | null {
        return pageNumber == LastPage
            ? this.lastPage?.absPageNumber ?? null
            : pageNumber;
    }

    get nextPageNumber(): number {
        // 1, 2, 4, 6, 8, ...
        if (!this.lastPage) {
            return 1;
        } else if (this.lastPage.absPageNumber == 1) {
            return 2;
        } else {
            return this.lastPage.absPageNumber + 2;
        }
    }

    getPage(pageNumber: PageNumber): Page | null {
        const absPageNumber = this.getAbsolutePageNumber(pageNumber);
        if (!absPageNumber) {
            return null;
        }
        const page = this.#pageByNumber[absPageNumber];
        return page;
    }
}

class BasePage {
    #book: Book;
    #absPageNumber: number;
    #uploadPath: string;
    #parent: string;

    constructor(
        book: Book,
        absPageNumber: number,
        uploadPath: string,
        parent: string
    ) {
        this.#book = book;
        this.#absPageNumber = absPageNumber;
        this.#uploadPath = uploadPath;
        this.#parent = parent;
    }

    get book() {
        return this.#book;
    }

    get pageNumber(): PageNumber {
        return this.book.getRelativePageNumber(this.#absPageNumber);
    }

    get absPageNumber() {
        return this.#absPageNumber;
    }

    private offsetPage(offset: number) {
        const index = this.book.pages.indexOf((this as unknown) as Page);
        if (index < 0) {
            throw new Error(`Current page not found?! ${this.absPageNumber}`);
        }
        const offsetIndex = index + offset;
        if (offsetIndex < 0 || offsetIndex >= this.#book.pages.length) {
            return null;
        }
        return this.#book.pages[offsetIndex];
    }

    get nextPage() {
        return this.offsetPage(+1);
    }

    get prevPage() {
        return this.offsetPage(-1);
    }

    get name() {
        return this.#uploadPath.substring((this.#parent + "/").length);
    }
}

class ScanPage extends BasePage {
    #scan: Scan;
    isScan: true;
    isMissing: false;
    isFile: false;

    constructor(book: Book, absPageNumber: number, scan: Scan) {
        super(book, absPageNumber, scan.uploadPath, scan.parent);
        this.#scan = scan;
        this.isScan = true;
        this.isMissing = false;
        this.isFile = false;
    }

    get scanProgress() {
        return this.#scan.progress;
    }
}

class MissingPage extends BasePage {
    isScan: false;
    isMissing: true;
    isFile: false;

    constructor(book: Book, absPageNumber: number, uploadPath: string) {
        super(book, absPageNumber, uploadPath, path.resolve(uploadPath, ".."));
        this.isScan = false;
        this.isMissing = true;
        this.isFile = false;
    }
}

class FilePage extends BasePage {
    #file: File;
    isScan: false;
    isMissing: false;
    isFile: true;

    constructor(book: Book, absPageNumber: number, file: File) {
        super(book, absPageNumber, file.uploadPath, file.parent);
        this.#file = file;
        this.isScan = false;
        this.isMissing = false;
        this.isFile = true;
    }

    get fileName() {
        return path.basename(this.#file.uploadPath);
    }

    get imgPath() {
        // Chrome on Android does some pretty aggressive disk based caching. I
        // don't want to give every scan a unique filename, so we use a query
        // param to bust the cache.
        return (
            path.join("/uploads", this.#file.uploadPath) +
            `?ts=${this.#file.mtime}`
        );
    }
}

type Page = ScanPage | FilePage | MissingPage;

export default Book;
export {
    Page,
    PageNumber,
    LastPage,
    parsePageNumber,
    BOOKS_FOLDER,
    bookFolder,
};
