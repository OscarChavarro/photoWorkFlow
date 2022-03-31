/*
Copyright (c) 2022, Oscar Chavarro (jedilink@gmail.com)
This code is closed source / propertary. Do not redistribute.
DISPLAIMER: Use AS IS, author is not responsible of any damages
caused by the misuse of this software.
*/

/*
Copyright (c) 2021, Oscar Chavarro (jedilink@gmail.com)
This code is closed source / propertary. Do not redistribute.
DISPLAIMER: Use AS IS, author is not responsible of any damages
caused by the misuse of this software.
*/

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

var data;

Router.route('/auth/instagram', {
    template: 'authInstagramTemplate',
    data: function() {
        return this.params.query;
    }
});

Template.authInstagramTemplate.onRendered(function() {
    Session.set('instagramUser', null);
    if ( !this.data || !this.data['code']) {
        console.log('No instagram client_id given');
        return;
    }

    Meteor.call('instagramCodeToAccessTokenAndUserId', this.data.code, function(e: any, r: any) {
        if (!e && r) {
            const o = JSON.parse(r);
            if ( o['user_id'] ) {
                Session.set('instagramUser', o);
            } else {
                console.log('Error on Instagram API call for authorization');
                console.log(o);
            }
        }
    });
});

Template.authInstagramTemplate.helpers({
    instagramUser: function() {
        return Session.get('instagramUser');
    }
});
