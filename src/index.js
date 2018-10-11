let responseFunctions = [];
let hasResponseFunctions = false;

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

  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

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
      let response;
      let error;
      let status = -1;
      if (!cb) {
        return;
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        if (options.accept !== 'application/json') {
          response = xhr.responseText;
        }
        if (options.accept === 'application/json') {
          try {
            response = JSON.parse(xhr.responseText);
          } catch (ex) {
            error = 'Invalid JSON. Did you specify accept header?';
          }
        }
      } else {
        status = xhr.status || -1;
        error = xhr.statusText || 'Network error';
      }
      if (!opts.skipResponseFunctions && hasResponseFunctions) {
        const respond = (req, err, res) => {
          let i = 0;
          const l = responseFunctions.length;
          let interrupted = false;
          let replay = false;
          const next = (result = {}) => {
            if (result.interrupt) {
              interrupted = true;
            }
            if (result.replay) {
              replay = true;
            }
          };
          while (i < l) {
            responseFunctions[i](req, err, res, next);
            i += 1;
          }

          if (replay) {
            makeRequest(url, method, data, opts, cb);
            return;
          }

          if (!interrupted) {
            cb(err, res);
          }
        };

        respond({ url }, error ? { error, status } : null, response, cb);
        return;
      }
      cb(error, response);
    }
  };

  xhr.send(JSON.stringify(data));
};

const api = {
  get(url, options, cb) {
    makeRequest(url, 'GET', null, options, cb);
  },
  post(url, data, options, cb) {
    makeRequest(url, 'POST', data, options, cb);
  },
  put(url, data, options, cb) {
    makeRequest(url, 'PUT', data, options, cb);
  },
  delete(url, options, cb) {
    makeRequest(url, 'DELETE', null, options, cb);
  },
  applyOnResponse(fn) {
    hasResponseFunctions = true;
    responseFunctions.push(fn);
  },
  clearResponseFunctions() {
    hasResponseFunctions = false;
    responseFunctions = [];
  },
};

export default api;
