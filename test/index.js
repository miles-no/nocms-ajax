import test from 'tape';
import mock from 'xhr-mock';
import ajaxApi from '../lib';

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

test('applied response function', (t) => {
  t.plan(2);
  const uri = '/applied-on-response';
  mock.get(uri, {
    body: '{ "status": "ok" }',
    status: 200,
  });

  ajaxApi.applyOnResponse((req, err, res, next) => {
    t.pass();
    next();
  });

  ajaxApi.get(uri, () => {
    t.pass();
  });
});

test('clear response functions', (t) => {
  t.plan(1);

  const uri = '/applied-on-response-clear';
  mock.get(uri, {
    body: '{ "status": "ok" }',
    status: 200,
  });

  ajaxApi.applyOnResponse((req, err, res, next) => {
    t.fail('Apply function should have been cleared');
    next();
  });

  ajaxApi.clearResponseFunctions();
  ajaxApi.get(uri, () => {
    t.pass();
  });
});

test('multiple applied response functions', (t) => {
  ajaxApi.clearResponseFunctions();

  t.plan(3);
  const uri = '/applied-on-response-multi';
  mock.get(uri, {
    body: '{ "status": "ok" }',
    status: 200,
  });

  ajaxApi.applyOnResponse((req, err, res, next) => {
    t.pass('fn 1 called');
    next();
  });
  ajaxApi.applyOnResponse((req, err, res, next) => {
    t.pass('fn 2 called');
    next();
  });

  ajaxApi.get(uri, () => {
    t.pass('callback called');
  });
});

test('applied function interruption', (t) => {
  ajaxApi.clearResponseFunctions();
  t.plan(1);
  const uri = '/applied-on-response-interruption';
  mock.get(uri, {
    body: '{ "status": "ok" }',
    status: 200,
  });

  ajaxApi.applyOnResponse((req, err, res, next) => {
    t.pass('applied function called');
    next({ interrupt: true });
  });

  ajaxApi.get(uri, () => {
    t.fail('interrupted callback called');
  });
});

test('skipResponseFunctions option', (t) => {
  ajaxApi.clearResponseFunctions();
  t.plan(1);
  const uri = '/applied-on-response-interruption';
  mock.get(uri, {
    body: '{ "status": "ok" }',
    status: 200,
  });

  ajaxApi.applyOnResponse(() => {
    t.fail('applied function called');
  });

  ajaxApi.get(uri, { skipResponseFunctions: true }, () => {
    t.pass('regular callback called');
  });
});
