(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.NoCMSAjax = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var makeRequest = function makeRequest(url, method, data, opts, callback) {
  var options = opts;
  var cb = callback;
  if (typeof opts === 'function') {
    cb = opts;
    options = {};
  }
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

  var userToken = document.cookie.replace(/(^|;)\\s*user-authenticated\\s*=\\s*([^;]+)/, '$1');
  if (userToken) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + authorizationToken);
  }

  var authorizationToken = document.cookie.replace(/(^|;)\\s*nocms-authenticated\\s*=\\s*([^;]+)/, '$1');
  if (authorizationToken) {
    xhr.setRequestHeader('X-Authorization', 'Bearer ' + authorizationToken);
  }

  xhr.send(JSON.stringify(data));
};

module.exports = {
  post: function post(url, data, options, cb) {
    makeRequest(url, 'POST', data, options, cb);
  },
  get: function get(url, options, cb) {
    makeRequest(url, 'GET', null, options, cb);
  }
};

},{}]},{},[1])(1)
});