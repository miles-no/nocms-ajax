const makeRequest = (url, method, data, opts, callback) => {
  let options = opts;
  let cb = callback;
  if (typeof opts === 'function') {
    cb = opts;
    options = {};
  }
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.onload = (e) => {
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
      const response = JSON.parse(xhr.responseText);
      cb(null, response);
    }
  };

  xhr.onerror = (e) => {
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

  const userToken = document.cookie.replace(/(^|;)\\s*user-authenticated\\s*=\\s*([^;]+)/, '$1');
  if(userToken){
    xhr.setRequestHeader('Authorization', 'Bearer ' + authorizationToken);
  }

  const authorizationToken = document.cookie.replace(/(^|;)\\s*nocms-authenticated\\s*=\\s*([^;]+)/, '$1');
  if(authorizationToken){
    xhr.setRequestHeader('X-Authorization', 'Bearer ' + authorizationToken);
  }

  xhr.send(JSON.stringify(data));
};

module.exports = {
  post(url, data, options, cb) {
    makeRequest(url, 'POST', data, options, cb);
  },
  get(url, options, cb) {
    makeRequest(url, 'GET', null, options, cb);
  },
};
