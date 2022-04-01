/*
Copyright (c) 2022, Oscar Chavarro (jedilink@gmail.com)
This code is closed source / propertary. Do not redistribute.
DISPLAIMER: Use AS IS, author is not responsible of any damages
caused by the misuse of this software.
*/

import https from 'https';
import querystring from 'querystring';

function getUserLoginPromise(userToken: any) {
    const o = JSON.parse(userToken);
    const access_token = o.access_token;
    const user_id = o.user_id;
    return new Promise((resolve, reject) => {
        var options = {
            host: 'graph.instagram.com',
            port: 443,
            path: '/' + user_id + '?fields=username&access_token=' + access_token,
            method: 'GET',
            headers: {
            }
        };

        const chunks_of_data: Array<any> = [];
        const req = https.request(options, (response: any) => {
            response.on('data', (fragments: any) => {
                chunks_of_data.push(fragments);
            });

            response.on('end', () => {
                let response_body = Buffer.concat(chunks_of_data);
                resolve(response_body.toString());
            });

            response.on('error', (error: any) => {
                console.log('error!', error);
                reject(error);
            });
        });
        req.end();
    });
}

function getUserIdAndAuthTokenPromise(code: string) {
	return new Promise((resolve, reject) => {
        var postData = querystring.stringify({
            client_id: '943888999641872',
            client_secret: 'c4a906f21c119d9e331ffa71bdf0edba',
            grant_type: 'authorization_code',
            redirect_uri: 'https://photo.cubestudio.co/auth/instagram',
            code: code
        });
        var options = {
            host: 'api.instagram.com',
            port: 443,
            path: '/oauth/access_token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        };
        const chunks_of_data: Array<any> = [];
        const req = https.request(options, (response: any) => {
            response.on('data', (fragments: any) => {
                chunks_of_data.push(fragments);
            });

            response.on('end', () => {
                let response_body = Buffer.concat(chunks_of_data);
                resolve(response_body.toString());
            });

            response.on('error', (error: any) => {
                console.log('error!', error);
                reject(error);
            });
        });
        req.write(postData);
        req.end();
	});
}

async function makeGetUserLoginRequest(token: any) {
    try {
		return await getUserLoginPromise(token);
    } catch ( e ) {
		console.log(e);
    }
}

async function makeSyncGetUserIdAndTokenRequest(code: string) {
	try {
		let response_body = await getUserIdAndAuthTokenPromise(code);

        return response_body;
	}
	catch ( e ) {
		console.log(e);
	}
    return null;
}

Meteor.methods({
    instagramCodeToAccessTokenAndUserId: async function(code: string) {
        const response = await makeSyncGetUserIdAndTokenRequest(code);
        const userLogin = await makeGetUserLoginRequest(response);
        return userLogin;
    }
});
