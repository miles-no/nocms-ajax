'use strict';

var ajax = require('./ajax');

var sendMessage = function sendMessage(messageType, messageData, o, callback) {
  var options = o;
  var cb = callback;
  var messageObj = {
    messageType: messageType,
    data: messageData
  };

  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  ajax.post('/api/message', messageObj, options, cb);
};

module.exports = {
  get: ajax.get,
  post: ajax.post,
  sendMessage: sendMessage
};
//# sourceMappingURL=index.js.map