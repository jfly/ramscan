import React from "react";
import { Link as MULink } from "@material-ui/core";
import { Link as RRLink } from "react-router-dom";

type LinkProps = {
    to: string;
    children: React.ReactNode;
};
function Link({ to, children }: LinkProps) {
    return (
        <MULink component={RRLink} to={to} color="inherit">
            {children}
        </MULink>
    );
}

export default Link;
