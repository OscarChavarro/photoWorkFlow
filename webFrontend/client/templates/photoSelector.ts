/*
Copyright (c) 2022, Oscar Chavarro (jedilink@gmail.com)
This code is closed source / propertary. Do not redistribute.
DISPLAIMER: Use AS IS, author is not responsible of any damages
caused by the misuse of this software.
*/

import { Template } from 'meteor/templating';
import { SliderEventManager } from '../imageSlider/SliderEventManager';
import { SliderEventManagerConfiguration } from '../imageSlider/SliderEventManagerConfiguration';
import 'bootstrap/dist/css/bootstrap.css';

Router.route('/photoSelector', {
    template: 'photoSelectorTemplate'
});

let eventManager: SliderEventManager;

Template.photoSelectorTemplate.onRendered(function() { 
    const config = new SliderEventManagerConfiguration(
        function ($item: JQuery): void {
            console.log('Like image ' + $item.index());
        },
        function ($item: JQuery): void {
            console.log('Dislike image ' + $item.index());
        },
        100, 200, 1, '.like', '.dislike'
    );
    eventManager = new SliderEventManager(config);
    eventManager.init(document.getElementById('tinderslide'));
});

Template.photoSelectorTemplate.events({
    'click .like, click .dislike': function(event: any): void {
        event.preventDefault();
        eventManager.processAction(document.getElementById('tinderslide'), event.currentTarget.className);
    },
    'click #nextButton': function() {
        $('#dynamicFrames>li:last-child').remove();
        $('<li>New</li>').insertBefore('#dynamicFrames>li');
    }
});
