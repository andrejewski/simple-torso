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

test('$("a").click() should follow absolute links', async t => {
  const link = 'http://example.com/';
  const webview = new StubWebview();
  webview.onMakeRequest((method, url) => {
    t.is(method, 'get');
    t.is(url, link);
    return Promise.resolve();
  });

  const url = 'http://example.com/index.html';
  const body = `<html><a href="${link}">Example.com</a></html>`;
  const webpage = new Webpage(webview, {_url: url, body});

  await webpage.$('a').click();
});

test('$("a").click() should follow relative links', async t => {
  const link = 'docs/index.html';
  const webview = new StubWebview();
  webview.onMakeRequest((method, url) => {
    t.is(method, 'get');
    t.is(url, `http://example.com/${link}`);
    return Promise.resolve();
  });

  const url = 'http://example.com/index.html';
  const body = `<html><a href="${link}">Example.com</a></html>`;
  const webpage = new Webpage(webview, {_url: url, body});

  await webpage.$('a').click();
});

test('$("a").click() should no-op for a #hash href', async t => {
  const webview = new StubWebview();
  webview.onMakeRequest(() => {
    t.fail('makeRequest() should not be called');
  });

  const body = '<html><a href="#bottom">Go to bottom</a></html>';
  const webpage = new Webpage(webview, {body});

  await webpage.$('a').click();
});

test('$("input[type=submit]").click() should call .submit()', async t => {
  const webview = new StubWebview();
  webview.onMakeRequest(() => {
    t.fail('makeRequest() should not be called');
  });

  const body = '<form><input type="submit"/></form>';
  const webpage = new Webpage(webview, {body});
  webpage._submit = el => {
    t.deepEqual(el, webpage.$('input'));
    return Promise.resolve();
  };

  await webpage.$('input').click();
});
