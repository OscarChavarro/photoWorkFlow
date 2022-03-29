/*
Copyright (c) 2022, Oscar Chavarro (jedilink@gmail.com)
This code is closed source / propertary. Do not redistribute.
DISPLAIMER: Use AS IS, author is not responsible of any damages
caused by the misuse of this software.
*/

import {Session} from 'meteor/session';
import {TranslatePair} from './TranslatePair';
import {Model} from '../model/Model';

export class Language {
    table: Array<TranslatePair>;

    constructor() {
        this.table = [];
    }

    public init(jsTable: Array<any>): void {
        for (let i = 0; i < jsTable.length; i++) {
            this.table.push(new TranslatePair(jsTable[i]));
        }
    }

    public translate(key: string): string | null {
        for (let i = 0; i < this.table.length; i++) {
            if (this.table[i].key === key) {
                return this.table[i].value;
            }
        }
        return null;
    }

    public static translate(key: string): string | null {
        /*
        const language = Language.getCurrentSelectedLanguage();
        if (!language) {
            return null;
        }
        return language.translate(key);*/
        return 'TUNTUN ' + key;
    }

    public static getCurrentSelectedLanguage(model: Model): Language | null {
        let index = Session.get('languageIndex');
        if (index == -1) {
            index = 0;
        }

        if (!model || index < 0 || index >= model.languages.length) {
            return null;
        }
        return model.languages[index];
    }
}
