const ClientOAuth2 = require('client-oauth2');
const express = require('express');
const popsicle = require('popsicle');
const app = express();
const clientRequest = require('client-oauth2/src/request');

const loggingRequest = (method, url, body, headers) => {
    console.log({
        method,
        url,
        body,
        headers
    });
    return clientRequest(method, url, body, headers);
}

const fdcBaseUrl = process.env.fdcApiUri;

const fdcAuth = new ClientOAuth2({
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    accessTokenUri: process.env.accessTokenUri,
    authorizationUri: process.env.authorizationUri,
    redirectUri: process.env.redirectUri,
    scopes: ['oms']
}, loggingRequest);

app.get('/auth/fdc', function (req, res) {
    const uri = fdcAuth.code.getUri();

    console.log(`Redirecting to ${uri} to allow the user to login and receive an auth code`);
    res.redirect(uri)
})

app.get('/auth/fdc/callback', async function (req, res) {
    let user = await fdcAuth.code.getToken(req.originalUrl);

    // Store the `access_token` and `refresh_token` token somewhere
    // and optionally store `expires` if you would like to optimistically
    // refresh the token before it expires
    console.log('Successful Authorization Response');
    console.log(user.data); //=> { access_token: '...', token_type: 'bearer', ... }

    // Example of refreshing a token
    // which should be used when an access token returns 401 because it has expired
    user = await user.refresh();

    // Get user info from FDC API
    console.log({
        url: `${fdcBaseUrl}/users/me`,
        header: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.data.access_token}`
        },
        method: 'GET'
    })
    const userInfoFromApiResponse = await popsicle.fetch(`${fdcBaseUrl}/users/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.data.access_token}`
        }
    });
    const userInfo = await userInfoFromApiResponse.json();

    const responseData = {
        auth: user.data,
        user: userInfo
    };

    return res.send(JSON.stringify(responseData));
})

app.listen(8001, 'localhost');
