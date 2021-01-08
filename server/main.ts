import { Meteor } from 'meteor/meteor';
import { ClicksCollection } from '/imports/db/clicks';
import '/imports/api/methods';
import sync from './sync';

Meteor.startup(() => {
    console.log(`Found ${ClicksCollection.find().count()} clicks`);

    function syncForever() {
        sync();
        Meteor.setTimeout(syncForever, 1000);
    }
    syncForever();
});
