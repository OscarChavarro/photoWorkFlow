/*
Copyright (c) 2022, Oscar Chavarro (jedilink@gmail.com)
This code is closed source / propertary. Do not redistribute.
DISPLAIMER: Use AS IS, author is not responsible of any damages
caused by the misuse of this software.
*/

import { Language } from './Language';

const table = [
    ['language.english', 'Inglés'],
    ['language.spanish', 'Español']
];

export class Spanish extends Language {
    constructor() {
        super();
        this.init(table);
    }
}
