/*
Copyright (c) 2022, Oscar Chavarro (jedilink@gmail.com)
This code is closed source / propertary. Do not redistribute.
DISPLAIMER: Use AS IS, author is not responsible of any damages
caused by the misuse of this software.
*/

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { ClientCollection } from '../../lib/databaseDefinitions/ClientCollection';
import { Client } from '../../lib/entity/Client';
import { SessionLocation } from '../../lib/entity/SessionLocation';
import { SessionIndex } from '/lib/entity/SessionIndex';
import 'bootstrap/dist/css/bootstrap.css';
import { SessionImage } from '/lib/entity/SessionImage';

Router.route('/adminPanel', {
    template: 'adminPanelTemplate',
    data: function() {
        return Meteor.subscribe('client');
    }
});

Template.adminPanelTemplate.onCreated(function() {
    Session.set('selectedClientId', null);
    Session.set('selectedSessionLocation', null);
    Session.set('selectedVariants', null);
    Session.set('selectedImageUrl', null);
});

Template.adminPanelTemplate.helpers({
    clients: function(): any {
        return ClientCollection.db.find({}, {sort: {name: 1}});
    },
    clientSelected: function(): boolean {
        const id = Session.get('selectedClientId');
        return id && id !== 'noclient' ? true : false;
    },
    selectedClient: function(): Client | null {
        const id = Session.get('selectedClientId');
        if ( id === 'noclient' ) {
            return null;
        }
        return ClientCollection.db.findOne({_id: id});
    },
    selectedSessionLocation: function() {
        let sl = Session.get('selectedSessionLocation');
        if ( !sl ) {
            const client = ClientCollection.db.findOne({_id: Session.get('selectedClientId')});
            Meteor.call('getSessionLocationsFromClientTag', client.tag, function(e: any, r: any) {
                if ( e ) {
                    console.log('Error:', e);
                    return;
                }
                const s: SessionLocation = r;
                Session.set('selectedSessionLocation', s);
            });
        }
        return Session.get('selectedSessionLocation');
    },
    selectedVariants: function() {
        return Session.get('selectedVariants');
    },
    selectedImages: function() {
        return Session.get('selectedImages');
    },
    selectedImageUrl: function() {
        return Session.get('selectedImageUrl');
    },
    isPresent: function(a: SessionImage, b: string): boolean {
        let c = false;
        for ( let i = 0; i < a.variants.length; i++ ) {
            if ( a.variants[i] === b ) {
                c = true;
            }
        }
        return c;
    }
});

Template.adminPanelTemplate.events({
    'click #addClientButton': function() {
        const clientName = '[New Client]';
        const id = ClientCollection.db.insert({name: clientName});
        Session.set('selectedClientId', id ? id: null);
        $('#clientList').val(id);
        $('#clientList')[0].focus();
    },
    'click #deleteClientButton': function() {
        const id = Session.get('selectedClientId');
        ClientCollection.db.remove({_id: id});
        Session.set('selectedClientId', null)
    },
    'change #clientList': function() {
        const id = $('#clientList').val();
        Session.set('selectedClientId', id ? id: null);
        Session.set('selectedSessionLocation', null);
        Session.set('selectedVariants', null);
        Session.set('selectedImageUrl', null);
    },
    'keyup #clientName': function(event: any): void {
        const name = event.currentTarget.value;
        const id = Session.get('selectedClientId');
        ClientCollection.db.update({_id: id}, {$set: {name: name}});
    },
    'keyup #clientTag': function(event: any): void {
        const tag = event.currentTarget.value;
        const id = Session.get('selectedClientId');
        ClientCollection.db.update({_id: id}, {$set: {tag: tag}});
    },
    'change #sessionList': function() {
        Session.set('selectedVariants', null);
        Session.set('selectedImageUrl', null);
        Meteor.call('getSessionIndexFromSessionLocation', Session.get('selectedSessionLocation'), function(e: any, r: any) {
            if (!e && r) {
                const si: SessionIndex = r;
                Session.set('selectedVariants', SessionIndex.getVariants(si));
                Session.set('selectedImages', si.matrix)
            }
        });
    },
    'mouseenter .imageCell': function(event: any): void {
        if ( !event || !event.currentTarget ) {
            return;
        }
        const id: any = event.currentTarget.id;
        $('.selectedCell').removeClass('selectedCell');
        $('#' + id).addClass('selectedCell');
        const sessionLocation: SessionLocation = Session.get('selectedSessionLocation');
        const subid = $('#sessionList').val();
        const mid = $('[value="' + subid + '"]')[0].innerHTML
        const url = sessionLocation.clientTag + '/' + mid + '/' + event.currentTarget.dataset.url;
        Session.set('selectedImageUrl', url);
    }
});
