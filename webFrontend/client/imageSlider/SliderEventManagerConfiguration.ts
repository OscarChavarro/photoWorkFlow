/*
Copyright (c) 2022, Oscar Chavarro (jedilink@gmail.com)
This code is closed source / propertary. Do not redistribute.
DISPLAIMER: Use AS IS, author is not responsible of any damages
caused by the misuse of this software.
*/

export class SliderEventManagerConfiguration {
    onLike: Function | null;
    onDislike: Function | null;
    animationSpeed: number;
    animationRevertSpeed: number;
    threshold: number;
    likeSelector: string;
    dislikeSelector: string;

    constructor(
        onLike: Function | null,
        onDislike: Function | null,
        animationRevertSpeed: number,
        animationSpeed: number,
        threshold: number,
        likeSelector: string,
        dislikeSelector: string) {
        this.onDislike = onDislike;
        this.onLike = onLike;
        this.animationSpeed = animationSpeed;
        this.animationRevertSpeed = animationRevertSpeed;
        this.threshold = threshold;
        this.likeSelector = likeSelector;
        this.dislikeSelector = dislikeSelector;
    }

    public defaultValues() {
        this.onLike = null;
        this.onDislike = null;
        this.animationSpeed = 400;
        this.animationRevertSpeed = 200;
        this.threshold = 1;
        this.likeSelector = '.like';
        this.dislikeSelector = '.dislike';
    }
}
