import { Meteor } from "meteor/meteor";
import "./publish";
import "./methods";
import { syncForever } from "./sync";

Meteor.startup(() => {
    syncForever();
});
