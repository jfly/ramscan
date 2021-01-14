import { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { FilesCollection } from "/imports/db/files";
import { useTracker } from "meteor/react-meteor-data";
import Book from "/imports/types/book";

function useBook(name: string) {
    const files = useTracker(() => {
        Meteor.subscribe("files/book", { bookName: name });
        return FilesCollection.find({ parent: `/books/${name}` }).fetch();
    });
    return new Book(name, files);
}

type WindowSize = {
    width?: number;
    height?: number;
};
// Copied from https://usehooks.com/useWindowSize/
function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount

    return windowSize;
}

type UseKeyPressProps = {
    onKeyDown: (ev: KeyboardEvent) => void;
    onKeyUp: (ev: KeyboardEvent) => void;
};
function useKeyPress({ onKeyDown, onKeyUp }: UseKeyPressProps) {
    // Add event listeners
    useEffect(() => {
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, []); // Empty array ensures that effect is only run on mount and unmount
}

export { useBook, useWindowSize, useKeyPress };
