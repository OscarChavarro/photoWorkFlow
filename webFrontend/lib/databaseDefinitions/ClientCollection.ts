/*
Copyright (c) 2022, Oscar Chavarro (jedilink@gmail.com)
This code is closed source / propertary. Do not redistribute.
DISPLAIMER: Use AS IS, author is not responsible of any damages
caused by the misuse of this software.
*/

import { Meteor } from 'meteor/meteor';

const globalClient = new Mongo.Collection('client');

if ( Meteor.isServer ) {
    Meteor.publish('client', function () {
        return globalClient.find({});
    });
    globalClient.allow({
        insert: function (userId: string, doc: any): boolean {
            return true;
        },
        update: function (userId: string, doc: any, fields: any, modifier: any): boolean {
            return true;
        },
        remove: function (userId: string, doc: any): boolean {
            return true;
        }
    });
}

export class ClientCollection {
    public static db = globalClient;
}
