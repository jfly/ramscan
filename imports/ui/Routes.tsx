import React from "react";
import Home from "./Home";
import BookPage from "./BookPage";
import PagePage from "./PagePage";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    RouteComponentProps,
} from "react-router-dom";
import { generatePath } from "react-router";
import { PageNumber, parsePageNumber } from "/imports/types/book";

function Error404() {
    return <div>Page Not Found</div>;
}

interface MatchBookParams {
    name: string;
}
interface MatchPageParams {
    bookName: string;
    pageNumber: string;
}
function Routes() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route
                    exact
                    path="/book/:name"
                    render={({
                        match,
                    }: RouteComponentProps<MatchBookParams>) => (
                        <BookPage name={match.params.name} />
                    )}
                />
                <Route
                    exact
                    path="/book/:bookName/:pageNumber"
                    render={({
                        match,
                    }: RouteComponentProps<MatchPageParams>) => {
                        return (
                            <PagePage
                                bookName={match.params.bookName}
                                pageNumber={parsePageNumber(
                                    match.params.pageNumber
                                )}
                            />
                        );
                    }}
                />
                <Route component={Error404} />
            </Switch>
        </Router>
    );
}

const paths = {
    book(name: string, pageNumber?: PageNumber) {
        if (!pageNumber) {
            return generatePath("/book/:name", { name });
        } else {
            return generatePath("/book/:name/:pageNumber", {
                name,
                pageNumber,
            });
        }
    },
};

export default Routes;
export { paths };
