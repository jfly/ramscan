import { Meteor } from "meteor/meteor";
import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { ClicksCollection } from "/imports/db/clicks";

const Clicker = () => {
    const clicks = useTracker(() => {
        return ClicksCollection.find().fetch();
    });

    const increment = () => {
        Meteor.call("clicks.add");
    };

    return (
        <div>
            <button onClick={increment}>Click Me</button>
            <p>You've pressed the button {clicks.length} times.</p>
        </div>
    );
};

export default Clicker;
