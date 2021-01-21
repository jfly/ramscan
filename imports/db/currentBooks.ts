import { Mongo } from "meteor/mongo";

export interface CurrentBook {
    _id?: string;
    bookName: string | null;
}
const CurrentBooksCollection = new Mongo.Collection<CurrentBook>(
    "currentBooks"
);

export { CurrentBooksCollection };
