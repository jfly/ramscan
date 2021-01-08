import { Meteor } from "meteor/meteor";
import "/imports/db/clicks";
import "/imports/api/methods";
import "./publish";
import { syncForever } from "./sync";

Meteor.startup(() => {
    syncForever();
});
