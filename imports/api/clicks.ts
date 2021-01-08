import { Mongo } from 'meteor/mongo';

export interface Click {
  _id?: string;
  createdAt: Date;
}

export const ClicksCollection = new Mongo.Collection<Click>('clicks');
