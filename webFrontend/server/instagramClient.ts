/*
Copyright (c) 2022, Oscar Chavarro (jedilink@gmail.com)
This code is closed source / propertary. Do not redistribute.
DISPLAIMER: Use AS IS, author is not responsible of any damages
caused by the misuse of this software.
*/

import https from 'https';
import querystring from 'querystring';

function getPromise(code: string) {
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
            path: '/oauth/access_token?=&=&=&code=' + code,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        };
        console.log(options);
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

async function makeSynchronousRequest(code: string) {
	try {
		let http_promise = getPromise(code);
		let response_body = await http_promise;

        console.log('= RESPONSE ==============================');
        console.log(response_body);
        return response_body;
	}
	catch(error) {
		console.log(error);
	}
    return null;
}

Meteor.methods({
    instagramCodeToAccessTokenAndUserId: async function(code: string) {
        var response;
        response = await makeSynchronousRequest(code);
        console.log('= FINAL ==============================');
        console.log(response);

        return response;
    }
});
