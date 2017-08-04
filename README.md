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

### sendMessage, (messageType, messageData, options, callback)
Sends a message to the message api.

### options object
The following options are supported:
`accept` sets the accept header of the request.
`contentType` can be set to `text/html`. Default is `application/json` which is parsed.
`responseRequired` is used for message api requests through `sendMessage` when a response on the message is required.
`secure` is used for the message api to prevent logging of sensitive information.
