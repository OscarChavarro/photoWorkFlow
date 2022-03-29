/*
Copyright (c) 2022, Oscar Chavarro (jedilink@gmail.com)
This code is closed source / propertary. Do not redistribute.
DISPLAIMER: Use AS IS, author is not responsible of any damages
caused by the misuse of this software.
*/

const { execSync } = require("child_process");

export class ServerConfig {
    public static getImagePath(): string | null {
        const hostname = execSync('hostname');
        let path = null;
        if ( hostname.indexOf('vagabunda') == 0 ) {
            path = '/Users/jedilink/usr/fotos';
        } else if ( hostname.indexOf('cubestudio') == 0 ) {
            path = '/var/www/html';
        }
        return path;
    }
}
