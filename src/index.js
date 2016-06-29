
const ajax = require('./ajax');

const sendMessage = (messageType, messageData, o, callback) => {
  let options = o;
  let cb = callback;
  const messageObj = {
    messageType,
    data: messageData,
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
  sendMessage
};
