/*
Copyright (c) 2022, Oscar Chavarro (jedilink@gmail.com)
This code is closed source / propertary. Do not redistribute.
DISPLAIMER: Use AS IS, author is not responsible of any damages
caused by the misuse of this software.
*/

import { Meteor } from 'meteor/meteor';
import { SliderEventManagerConfiguration } from './SliderEventManagerConfiguration';

export class SliderEventManager {
    private config: SliderEventManagerConfiguration;
    private $container: any = null;
    private $panes: any = null;
    private xStart: number = 0;
    private touchStart: boolean = false;
    private posX: number = 0;
    private posY: number = 0;
    private lastPosX: number = 0;
    private paneCount: number = 0;
    private currentPaneIndex: number = 0;
    private paneWidth: number = 0;

    constructor(config: SliderEventManagerConfiguration) {
        this.config = config;
        this.$container = null;
        this.$panes = null;
        this.xStart = 0;
        this.touchStart = false;
        this.posX = 0;
        this.posY = 0;
        this.lastPosX = 0;
        this.paneCount = 0;
        this.currentPaneIndex = 0;
        this.paneWidth = 0;
    }

    private showPane(index: any): void {
        this.$panes.eq(this.currentPaneIndex).remove();
        this.currentPaneIndex = index;
    }

    private next(that: SliderEventManager): void {
        return that.showPane(that.currentPaneIndex - 1);
    }

    private likeWithAnim(): void {
        const reportCallback = this.config.onLike;
        const timeout = this.config.animationSpeed;
        const endState = 'translate(' + this.paneWidth + 'px, 0px) rotate(60deg)';
        const $element = this.$panes.eq(this.currentPaneIndex);
        this.animateCard(reportCallback, $element, endState, timeout);
    }

    private dislikeWithAnim(): void {
        const reportCallback = this.config.onDislike;
        const timeout = this.config.animationSpeed;
        const endState = 'translate(-' + this.paneWidth + 'px, 0px) rotate(-60deg)';
        const $element = this.$panes.eq(this.currentPaneIndex);
        this.animateCard(reportCallback, $element, endState, timeout);
    }

    private animateCard(
        reportCallback: Function | null,
        $element: JQuery,
        endState: string,
        timeout: number): void {
    
        const animation = $element[0].animate(
            [{"transform": endState}],
            {duration: timeout, fill: 'forwards'}
        );

        const that = this;
        Meteor.setTimeout(function() {
            animation.commitStyles();
            animation.cancel();
            if(reportCallback) {
                reportCallback($element);
                that.next(that);
            }
        }, timeout);
    }

    private handler(ev: any): void {
        ev.preventDefault();
        const that: SliderEventManager = ev.currentTarget._variable;

        switch( ev.type ) {
            case 'touchstart':
                if ( that.touchStart === false ) {
                    that.touchStart = true;
                    that.xStart = ev.originalEvent.touches[0].pageX;
                }
            case 'mousedown':
                if ( that.touchStart === false ) {
                    that.touchStart = true;
                    that.xStart = ev.pageX;
                }
                break;
            case 'mousemove':
            case 'touchmove':
                if ( that.touchStart === true ) {
                    let pageX = typeof ev.pageX == 'undefined' ? ev.originalEvent.touches[0].pageX : ev.pageX;
                    let deltaX = parseInt(pageX) - that.xStart;
                    let percent = ((100 / that.paneWidth) * deltaX) / that.paneCount;

                    that.posX = deltaX + that.lastPosX;
                    that.posY = 0;
                    const t = "translate(" + that.posX + "px," + that.posY + "px) rotate(" + (percent ) + "deg)";
                    that.$panes.eq(that.currentPaneIndex).css("transform", t);

                    let opa = (Math.abs(deltaX) / that.config.threshold) / 100 + 0.2;

                    if ( opa > 1.0 ) {
                        opa = 1.0;
                    }
                    if ( that.posX >= 0 ) {
                        that.$panes.eq(that.currentPaneIndex).find(that.config.likeSelector).css('opacity', opa);
                        that.$panes.eq(that.currentPaneIndex).find(that.config.dislikeSelector).css('opacity', 0);
                    } else if ( that.posX < 0 ) {
                        that.$panes.eq(that.currentPaneIndex).find(that.config.dislikeSelector).css('opacity', opa);
                        that.$panes.eq(that.currentPaneIndex).find(that.config.likeSelector).css('opacity', 0);
                    }
                }
                break;
            case 'mouseup':
            case 'touchend':
                that.touchStart = false;
                const pageX = (typeof ev.pageX == 'undefined') ? ev.originalEvent.changedTouches[0].pageX : ev.pageX;
                const deltaX = parseInt(pageX) - that.xStart;

                that.posX = deltaX + that.lastPosX;
                that.posY = 0;
                const opa = Math.abs((Math.abs(deltaX) / that.config.threshold) / 100 + 0.2);
                const $element = that.$panes.eq(that.currentPaneIndex);

                if ( opa >= that.config.threshold ) {
                    // User has made a selection
                    const reportCallback = that.posX < 0 ? that.config.onDislike : that.config.onLike;
                    const sign = (that.posX < 0 ? '-': '');
                    const endState = 'translate(' + sign + (that.paneWidth) + 'px,' + (that.posY + that.paneWidth) + 'px) rotate(' + sign + '60deg)';
                    that.animateCard(reportCallback, $element, endState, that.config.animationSpeed);
                } else {
                    // Swipe is to short, revert to original state
                    that.lastPosX = 0;
                    that.touchStart = false;
                    const endState = 'translate(0px,0px) rotate(0deg)';
                    that.animateCard(null, $element, endState, that.config.animationSpeed);

                    that.$panes.eq(that.currentPaneIndex).find(that.config.likeSelector).animate({'opacity': 0}, that.config.animationRevertSpeed);
                    that.$panes.eq(that.currentPaneIndex).find(that.config.dislikeSelector).animate({'opacity': 0}, that.config.animationRevertSpeed);
                }
                break;
        }
    }

    public init(element: any): void {
        if (!element) {
            return;
        }
        this.$container = $(">ul", element);
        this.$panes = $(">ul>li", element);
        const w = this.$container.width();
        this.paneWidth = w ? w : 0;
        this.paneCount = this.$panes.length;
        this.currentPaneIndex = this.$panes.length - 1;

        element._variable = this;

        $(element).on('touchstart mousedown', this.handler);
        $(element).on('touchmove mousemove', this.handler);
        $(element).on('touchend mouseup', this.handler);
    }

    public processAction(element: any, className: string): void {
        element._variable = this;
        switch (className) {
            case 'like':
                this.likeWithAnim();
                break;
            case 'dislike':
                this.dislikeWithAnim();
                break;
            }
    }
}
