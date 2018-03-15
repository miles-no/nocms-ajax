const test = require('tape');
const mock = require('xhr-mock').default;
const ajaxApi = require('../lib');

mock.setup();
 
global.document = { cookie: '' };

test('get requests should return json by default', (t) => {
  t.plan(1);
  const uri = '/test';
  mock.get(uri, {
    body: '{ "text": "Hello" }',
    status: 200,
  });

  ajaxApi.get(uri, (err, res) => {
    t.deepEqual(res, { text: 'Hello' });
  });
});

test('get requests should return text if accept header is set', (t) => {
  t.plan(2);
  const uri = '/test/text';
  mock.get(uri, (req, res) => {
    t.equals(req.header('Accept'), 'text/plain');
    return res.status(200).body('Hello tester!');
  });

  ajaxApi.get(uri, { accept: 'text/plain' }, (err, res) => {
    t.equals(res, 'Hello tester!');
  });
});


test('responseRequired option should set pragma header', (t) => {
  t.plan(2);
  const uri = '/message-response';
  mock.post(uri, (req, res) => {
    t.equals(req.header('Pragma'), 'response-expected');
    return res.status(200).body();
  });

  ajaxApi.post(uri, {}, { responseRequired: true }, () => {
    t.pass();
  });
});

test('secure option should set pragma header', (t) => {
  t.plan(2);
  const uri = '/message-secure';
  mock.post(uri, (req, res) => {
    t.equals(req.header('Pragma'), 'secure-message');
    return res.status(200).body();
  });

  ajaxApi.post(uri, {}, { secure: true }, () => {
    t.pass();
  });
});

test('put requests', (t) => {
  t.plan(1);
  const uri = '/message-put';
  mock.put(uri, (req, res) => {
    return res.status(200).body('{ "status": "ok" }');
  });

  ajaxApi.put(uri, { foo: 1 }, (err, res) => {
    t.deepEqual(res, { status: 'ok' });
  });
});

test('delete requests', (t) => {
  t.plan(1);
  const uri = '/message-put';
  mock.delete(uri, (req, res) => {
    return res.status(200).body('{ "status": "ok" }');
  });

  ajaxApi.delete(uri, (err, res) => {
    t.deepEqual(res, { status: 'ok' });
  });
});

// test('get requests return an object', (t) => {
//   server.respondWith('GET', '/test', [
//     200, { 'Content-Type': 'application/json' }, JSON.stringify({ foo: 1 }),
//   ]);
//   t.plan(1);
//   ajaxApi.get('/test', () => {
//     t.pass('Callback should have been called');
//     t.end();
//   });
//   server.respond();
// });
