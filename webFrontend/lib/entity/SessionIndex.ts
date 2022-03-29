/*
Copyright (c) 2022, Oscar Chavarro (jedilink@gmail.com)
This code is closed source / propertary. Do not redistribute.
DISPLAIMER: Use AS IS, author is not responsible of any damages
caused by the misuse of this software.
*/

import { SessionImage } from "./SessionImage";

export class SessionIndex {
    matrix: Array<SessionImage>;

    constructor() {
        this.matrix = [];
    }

    public static getVariants(that: SessionIndex): Array<string> {
        const variants:any = {};
        for ( let i = 0; i < that.matrix.length; i++ ) {
            const vi = that.matrix[i].variants;
            for ( let j = 0; j < vi.length; j++ ) {
                const nj = vi[j];
                if ( !variants[nj] ) {
                    variants[nj] = 1;
                }
            }
        }

        const arr: Array<string> = [];
        for ( let n in variants ) {
            arr.push(n);
        }
        arr.sort();
        return arr;
    }
}
