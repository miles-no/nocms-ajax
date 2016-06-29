'use strict';

var makeRequest = function makeRequest(url, method, data) {
  var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
  var cb = arguments[4];

  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (!cb) {
        return;
      }
      if (xhr.status !== 200) {
        cb({ status: xhr.status, error: xhr.statusText }, null);
        return;
      }
      if (options.contentType === 'text/html') {
        cb(null, xhr.responseText);
        return;
      }
      var response = JSON.parse(xhr.responseText);
      cb(null, response);
    }
  };

  xhr.onerror = function (e) {
    cb({ status: xhr.status, error: xhr.statusText }, null);
  };

  if (options.responseRequired) {
    xhr.setRequestHeader('Pragma', 'response-expected');
  }
  if (options.secure) {
    xhr.setRequestHeader('Pragma', 'secure-message');
  }
  if (options.accept) {
    xhr.setRequestHeader('Accept', options.accept);
  }
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));
};

module.exports = {
  post: function post(url, data, opts, callback) {
    var options = opts;
    var cb = callback;
    if (typeof opts === 'function') {
      cb = opts;
      options = null;
    }
    makeRequest(url, 'POST', data, options, cb);
  },
  get: function get(url, opts, callback) {
    var options = opts;
    var cb = callback;
    if (typeof opts === 'function') {
      cb = opts;
      options = {};
    }
    makeRequest(url, 'GET', null, options, cb);
  }
};
//# sourceMappingURL=ajax.js.map