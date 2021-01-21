import { Meteor } from "meteor/meteor";
import "./publish";
import "./methods";
import "./api";
import { syncForever } from "./sync";
import { CurrentBooksCollection } from "/imports/db/currentBooks";

Meteor.startup(() => {
    syncForever();
    CurrentBooksCollection.upsert({}, { bookName: null });
});
