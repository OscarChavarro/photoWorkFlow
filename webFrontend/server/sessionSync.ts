/*
Copyright (c) 2022, Oscar Chavarro (jedilink@gmail.com)
This code is closed source / propertary. Do not redistribute.
DISPLAIMER: Use AS IS, author is not responsible of any damages
caused by the misuse of this software.
*/

import { Meteor } from 'meteor/meteor';
import { SessionLocation } from '../lib/entity/SessionLocation';
import { StorageProvider } from '../lib/entity/StorageProvider';
import { ServerConfig } from './ServerConfig';
import { SessionIndex } from '../lib/entity/SessionIndex';
import { SessionImage } from '/lib/entity/SessionImage';

const fs = require('fs');

Meteor.methods({
    getSessionLocationsFromClientTag: function(clientTag: string): SessionLocation {
        const location = new SessionLocation(clientTag, StorageProvider.LOCAL_FILE);

        const path = ServerConfig.getImagePath();
        if ( !path ) {
            location.provider = StorageProvider.ERROR;
            location.errorMessage = 'Path not found';
            return location;
        }

        const tagPath = path + '/' + clientTag;

        let files = null;
        try {
            files = fs.readdirSync(tagPath);
        } catch ( e ) {
            location.provider = StorageProvider.ERROR;
            location.errorMessage = 'EXCEPTION: ' + e;
            return location;
        }
        
        if ( !files ) {
            location.provider = StorageProvider.ERROR;
            location.errorMessage = 'No folder [' + tagPath + '] found';
            return location;
        }

        if ( !files.length || files.length <= 0 ) {
            location.provider = StorageProvider.ERROR;
            location.errorMessage = 'No sessions inside folder [' + tagPath + '] found';
            return location;
        }

        try {
            for (let i = 0; i < files.length; i++) {
                location.sessionPaths.push(files[i]);
            }
            location.errorMessage = 'Found: ' + files.length;
        } catch ( e ) {
            location.provider = StorageProvider.ERROR;
            location.errorMessage = 'E2: ' + e;
            return location;
        }
        return location;
    },
    getSessionIndexFromSessionLocation: function(sessionLocation: SessionLocation): SessionIndex | null {
        const index = new SessionIndex();
        const path = ServerConfig.getImagePath();
        if ( !path ) {
            return null;
        }

        try {
            const hashMap: any = {};
            const basePath = path + '/' + sessionLocation.clientTag + '/';
            for ( let i = 0; i < sessionLocation.sessionPaths.length; i++ ) {
                const sessionPath = basePath + sessionLocation.sessionPaths[i] + '/';
                console.log(sessionPath);
                const groups = fs.readdirSync(sessionPath);
                for ( let j = 0; j < groups.length; j++ ) {
                    const variant = groups[j];
                    console.log('  - ' + variant);
                    const groupPath = sessionPath + variant;
                    const images = fs.readdirSync(groupPath);
                    for ( let k = 0; k < images.length; k++ ) {
                        const filename = images[k];
                        console.log('    . ' + filename);
                        if ( !hashMap[filename] ) {
                            hashMap[filename] = new SessionImage(filename);
                        }
                        hashMap[filename].variants.push(groups[j]);
                    }
                }
            }

            const arr = [];
            for ( let name in hashMap ) {
                arr.push(name);
            }
            arr.sort();
            for ( let i = 0; i < arr.length; i++ ) {
                console.log('Name: ' + arr[i]);
                if ( arr[i].indexOf('jpg') >= 0 ) {
                    hashMap[arr[i]].variants.sort();
                    index.matrix.push(hashMap[arr[i]]);
                }
            }
        } catch ( e ) {
            return null;
        } 
        return index;
    }
});
