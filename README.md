# NoCMS Events

Ajax functions for NoCMS


## Installation

Install nocms-events from NPM and include it in your own React build process (using [Browserify](http://browserify.org), [Webpack](http://webpack.github.io/), etc).

```
npm install nocms-ajax --save
```

## Usage

```
import ajax from 'nocms-ajax';

```

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
