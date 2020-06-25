# FDC OAuth and Api Example

This application provides an example application of:
 
* A working example of the [Authorization Grant](https://tools.ietf.org/html/rfc6749#section-4.1) flow for [OAuth 2.0 Authentication](https://oauth.net/2/)
   * Includes a web server to actually interact with the auth code flow
   * Negotiates callback and POSTing to get the access token from the auth code
* A working example of an API call to the [FDC API](https://fulfillment.github.io/api/) to retrieve the authenticated user's info

## Requirements

* [Node v8+](https://nodejs.org/en/)
* [NPM](https://www.npmjs.com/)

## Installation

* From the base folder run the following from the command line
  * `npm install`

## Environment Setup

* Make a copy of `.env.example.json` and rename it `.env.json`
* In `.env.json` replace values like `[yourSecret]` with the corresponding value you received from FDC
  * EX `[yourSecret]` with `xGd1BeDw9BaH`
  
## Usage

* Start the application
  *  From the base folder run the following from the command line
    * `npm run server`
* In your browser navigate to `http://localhost:8001/auth/fdc` and proceed with authorization
* At the end of the authorization flow your browser will display a JSON response containing your authentication data and user information

## Learning/Debugging Tips

Every request is logged to the console so you can see each request in the flow
