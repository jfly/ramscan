import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { DocsCollection } from "/imports/db/docs";
import { Link } from "react-router-dom";

const Docs = () => {
    const docs = useTracker(() => {
        return DocsCollection.find().fetch();
    });

    return (
        <ul>
            {docs.map((doc) => (
                <li key={doc._id}>
                    <Link to={`/doc/${doc.name}`}>{doc.name}</Link>
                </li>
            ))}
        </ul>
    );
};

const Home = () => {
    return <Docs />;
};

export default Home;
