/*
Copyright (c) 2022, Oscar Chavarro (jedilink@gmail.com)
This code is closed source / propertary. Do not redistribute.
DISPLAIMER: Use AS IS, author is not responsible of any damages
caused by the misuse of this software.
*/

export class TranslatePair {
    key: string;
    value: string;

    constructor(jsArray: any) {
        this.key = jsArray[0];
	this.value = jsArray[1];
    }
}
