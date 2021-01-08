import { Meteor } from "meteor/meteor";
import { ClicksCollection } from "/imports/db/clicks";

Meteor.methods({
    "clicks.add"() {
        ClicksCollection.insert({ createdAt: new Date() });
    },
});
