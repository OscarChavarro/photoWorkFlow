/*
Copyright (c) 2022, Oscar Chavarro (jedilink@gmail.com)
This code is closed source / propertary. Do not redistribute.
DISPLAIMER: Use AS IS, author is not responsible of any damages
caused by the misuse of this software.
*/

import { StorageProvider } from "./StorageProvider";

export class SessionLocation {
    clientTag: string;
    provider: StorageProvider;
    errorMessage?: string;
    sessionPaths: any;

    constructor(clientTag: string, provider: StorageProvider) {
        this.clientTag = clientTag;
        this.provider = provider;
        this.sessionPaths = [];
    }
}
