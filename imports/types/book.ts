import { File } from "/imports/db/files";

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
    constructor(name: string, files: File[]) {
        this.#name = name;
        // >>> TODO: sort <<<
        this.#pages = files.map((file, i) => new Page(this, i + 1, file));
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

class Page {
    #book: Book;
    #file: File;
    #pageNumber: PageNumber;
    constructor(book: Book, pageNumber: PageNumber, file: File) {
        this.#book = book;
        this.#pageNumber = pageNumber;
        this.#file = file;
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

    get name() {
        return this.#file.publicPath.substring(
            (this.#file.parent + "/").length
        );
    }

    get imgPath() {
        return this.#file.publicPath;
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
}

export default Book;
export { Page, PageNumber, LastPage, parsePageNumber };
