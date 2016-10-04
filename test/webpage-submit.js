import test from 'ava';
import {Webview, Webpage} from '../lib/';

class StubWebview extends Webview {
  onMakeRequest(func) {
    this._makeRequest = func;
  }

  makeRequest(...args) {
    return this._makeRequest(...args);
  }
}

test('$("*").submit() should use the nearest parent form', async t => {
  const webview = new StubWebview();
  webview.onMakeRequest((method, url, body) => {
    t.is(method, 'get');
    t.is(url, 'http://example.com/git-money');
    return Promise.resolve();
  });

  const url = 'http://example.com/';
  const body = `
    <form method='post' action='/giv-money'>
      <form method='get' action='/git-money'>
        <input type='submit' value='Git money'>
      </form>
    </form>
  `;
  const webpage = new Webpage(webview, {_url: url, body});
  await webpage.$('input').submit();
});

test('$("*").submit() should reject if no form is found', async t => {
  const body = `
    <div method='get' action='/git-money'>
      <input type='submit' value='Git money'>
    </div>
  `;
  const webpage = new Webpage(null, {body});

  await t.throws(webpage.$('input').submit());
});

test('$("form").submit() should send form data to method/action', async t => {
  const webview = new StubWebview();
  const rMethod = 'jump';
  const rAction = 'http://over-the-moon.com/';
  webview.onMakeRequest((method, url) => {
    t.is(method, rMethod);
    t.is(url, rAction);
    return Promise.resolve();
  });

  const url = 'http://example.com/';
  const body = `
    <form method='${rMethod}' action='${rAction}'>
      <input type='hidden' name='noun' value='cow'>
      <input type='submit' value='Initiate'>
    </form>
  `;

  const webpage = new Webpage(webview, {_url: url, body});
  await webpage.$('input[type=submit]').submit();
});

test('$("form").submit() should default to "action" as current url', async t => {
  const _url = 'http://example.com/form.html';
  const webview = new StubWebview();
  webview.onMakeRequest((method, url) => {
    t.is(method, 'get');
    t.is(url, _url);
    return Promise.resolve();
  });

  const body = `
    <form method='get'>
      <input type='submit'>
    </form>
  `;
  const webpage = new Webpage(webview, {_url, body});
  await webpage.$('input').submit();
});

test('$("form").submit() should default to "method" as GET', async t => {
  const _url = 'http://example.com/form.html';
  const webview = new StubWebview();
  webview.onMakeRequest((method, url) => {
    t.is(method, 'get');
    t.is(url, _url);
    return Promise.resolve();
  });

  const body = `
    <form action='${_url}'>
      <input type='submit'>
    </form>
  `;
  const webpage = new Webpage(webview, {_url, body});
  await webpage.$('input').submit();
});
