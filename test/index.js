const sinon = require('sinon');
const ajaxApi = require('../src/index');
const test = require('tape');

let server;

// @TODO these tests needs to run in a browser.

test('setup', (t) => {
  server = sinon.fakeServer.create();
  t.end();
});

test('get requests return an object', (t) => {
  server.respondWith('GET', '/test', [
    200, { 'Content-Type': 'application/json' }, JSON.stringify({ foo: 1 }),
  ]);
  t.plan(1);
  ajaxApi.get('/test', () => {
    t.pass('Callback should have been called');
    t.end();
  });
  server.respond();
});

test('teardown', (t) => {
  server.restore();
  t.end();
});
