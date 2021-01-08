import React from "react";
import Clicker from "./Clicker";
import Home from "./Home";
import Doc from "./Doc";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
    RouteComponentProps,
} from "react-router-dom";

type LayoutProps = {
    children: React.ReactNode;
};
function Layout({ children }: LayoutProps) {
    return (
        <>
            <h1>Welcome to Meteor!</h1>
            <div className="nav">
                <NavLink exact to="/">
                    Go home
                </NavLink>
                <NavLink exact to="/clicker">
                    Click a button
                </NavLink>
            </div>
            {children}
        </>
    );
}

function Error404() {
    return <div>Page Not Found</div>;
}

interface MatchNameParams {
    name: string;
}

export const App = () => (
    <Router>
        <Layout>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route
                    exact
                    path="/doc/:name"
                    render={({
                        match,
                    }: RouteComponentProps<MatchNameParams>) => (
                        <Doc name={match.params.name} />
                    )}
                />
                <Route path="/clicker" component={Clicker} />
                <Route component={Error404} />
            </Switch>
        </Layout>
    </Router>
);
