import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { DocsCollection } from "/imports/db/docs";
import { Link } from "react-router-dom";

type DocProps = {
    name: string;
};
const Doc = ({ name }: DocProps) => {
    return <div>hiya {name}</div>;
};

export default Doc;
