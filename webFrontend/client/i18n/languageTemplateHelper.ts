/*
Copyright (c) 2022, Oscar Chavarro (jedilink@gmail.com)
This code is closed source / propertary. Do not redistribute.
DISPLAIMER: Use AS IS, author is not responsible of any damages
caused by the misuse of this software.
*/

import {globalModel} from '../configState';
import {Language} from './Language';

Template.registerHelper("translate", function(key: string)
{
    const language = Language.getCurrentSelectedLanguage(globalModel);
    if (!language) {
        return '<No language>';
    }
    const t = language.translate(key);
    if (t) {
        return t;
    }
    return '<' + key + '>';
});
