# NoCMS Ajax

Ajax functions for NoCMS

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Dependency Status](https://david-dm.org/miles-no/nocms-ajax.svg)](https://david-dm.org/miles-no/nocms-ajax)
[![devDependencies](https://david-dm.org/miles-no/nocms-ajax/dev-status.svg)](https://david-dm.org/miles-no/nocms-ajax?type=dev)


## Installation

Install nocms-ajax from NPM and include it in your own React build process (using [Browserify](http://browserify.org), [Webpack](http://webpack.github.io/), etc).

```
npm install nocms-ajax --save
```

## Usage

```
import ajax from 'nocms-ajax';

```

## Commit message format and publishing

This repository is published using `semantic-release`, with the default [AngularJS Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit).

## API

### get, (url, options, callback)
Sends a get request and parse a JSON response. See options for other content types.

### post, (url, data, options, callback)
Sends a post request with a JSON body

### put, (url, data, options, callback)
Sends a put request with a JSON body

### delete, (url,  options, callback)
Sends a delete request with a JSON body

### Response function
Response functions can be applied to every request, acting as a middleware prior to the callback functions.

#### applyOnResponse, (fn)
If you need to interrupt responses, e.g. if you want to reauthenticate upon 401 responses, you could apply a response function.

```js
import ajax from 'nocms-ajax';
ajax.applyOnResponse((req, err, res, next) => {
  if (err.status === 401) {
    window.location = '/login';
    next({ interrupt: true });
  } else {
    next();
  }
});
```
This response functions take an object `req`, currently including the url 
of the request, `err`, including the error response object, `res`, the response
 object and `next` a function for proceeding with the next response 
 function or callback invokation.

 Pass on `{ interrupt: true }` to prevent further handling of the response.

#### clearResponseFunctions
Removes all registered response functions.

### options object
The following options are supported:
`accept` sets the accept header of the request. Default: `application/json`, and thus the response is parsed.
`responseRequired` is used for message api requests when a response on the message is required.
`secure` is used for the message api to prevent logging of sensitive information.
