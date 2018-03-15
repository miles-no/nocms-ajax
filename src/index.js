const makeRequest = (url, method, data, opts, callback) => {
  let options = opts;
  let cb = callback;
  if (typeof opts === 'function') {
    cb = opts;
    options = {};
  }
  options.accept = opts.accept || 'application/json';

  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);

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

  const authorizationToken = document.cookie.replace(/(?:(?:^|.*;\s*)nocms-authenticated\s*=\s*([^;]*).*$)|^.*$/, '$1');

  const userToken = document.cookie.replace(/(?:(?:^|.*;\s*)user-authenticated\s*=\s*([^;]*).*$)|^.*$/, '$1');
  if (userToken) {
    xhr.setRequestHeader('Authorization', `Bearer ${authorizationToken}`);
  }

  if (authorizationToken) {
    xhr.setRequestHeader('X-Authorization', `Bearer ${authorizationToken}`);
  }

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (!cb) {
        return;
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        if (options.accept !== 'application/json') {
          cb(null, xhr.responseText);
          return;
        }

        try {
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        } catch (error) {
          cb({ status: -1, error: 'Invalid JSON. Did you specify accet header?' });
        }
      } else {
        cb({ status: xhr.status || -1, error: xhr.statusText || 'Network error' }, null);
      }
    }
  };

  xhr.send(JSON.stringify(data));
};

module.exports = {
  post(url, data, options, cb) {
    makeRequest(url, 'POST', data, options, cb);
  },
  get(url, options, cb) {
    makeRequest(url, 'GET', null, options, cb);
  },
  delete(url, options, cb) {
    makeRequest(url, 'DELETE', null, options, cb);
  },
};
