var ClientOAuth2 = require('client-oauth2')
var express = require('express')
var app = express()

var fdcAuth = new ClientOAuth2({
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    accessTokenUri: process.env.accessTokenUri,
    authorizationUri: process.env.authorizationUri,
    redirectUri: process.env.redirectUri,
    scopes: ['oms']
})

app.get('/auth/fdc', function (req, res) {
    var uri = fdcAuth.code.getUri()

    res.redirect(uri)
})

app.get('/auth/fdc/callback', function (req, res) {
    fdcAuth.code.getToken(req.originalUrl)
        .then(function (user) {
            console.log(user) //=> { accessToken: '...', tokenType: 'bearer', ... }

            // Refresh the current users access token.
            user.refresh().then(function (updatedUser) {
                console.log(updatedUser !== user) //=> true
                console.log(updatedUser.accessToken)
            })

            // We should store the token into a database.
            return res.send(JSON.stringify(user.data))
        })
})

app.listen(8001, 'localhost');
