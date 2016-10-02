import test from 'ava';
import {Browser, Session, Webview} from '../lib/';

test('constructor should set baseUrl', t => {
  const baseUrl = 'http://example.com';
  const browser = new Browser({baseUrl});

  t.is(browser.baseUrl(), baseUrl);
});

test('constructor should set userAgent', t => {
  const userAgent = 'i am chrome';
  const browser = new Browser({userAgent});

  t.is(browser.userAgent(), userAgent);
});

test('createSession() should return a session', t => {
  const browser = new Browser();
  const session = browser.createSession();
  t.true(session instanceof Session);
});

test('createWebview() should return a webview', t => {
  const browser = new Browser();
  const webview = browser.createWebview();
  t.true(webview instanceof Webview);
});

test('baseUrl() should get+set the baseUrl', t => {
  const browser = new Browser();
  t.falsy(browser.baseUrl());

  const baseUrl = 'http://example.com';
  t.is(browser.baseUrl(baseUrl), baseUrl);
});

test('baseUrl() should throw if baseUrl lacks http[s]://', t => {
  const browser = new Browser();
  const http = 'http://example,com';
  const https = 'http://example.com';
  const ftp = 'ftp://example.com';

  t.notThrows(() => browser.baseUrl(http));
  t.notThrows(() => browser.baseUrl(https));
  t.throws(() => browser.baseUrl(ftp));
});

test('userAgent() should get+set the user agent', t => {
  const browser = new Browser();
  t.falsy(browser.userAgent());

  const userAgent = 'i am chrome';
  t.is(browser.userAgent(userAgent), userAgent);
});

test('makeRequest() should combine query object with url query path', async t => {
  const browser = new Browser();
  browser._makeRequest = (method, url, query) => {
    t.is(method, rMethod);
    t.is(url, 'http://example.com/index.html');
    t.deepEqual(query, {
      abc: 'def',
      def: 'abc',
      one: 'two',
      two: 'one'
    });
    return Promise.resolve();
  };

  const rMethod = 'get';
  const url = 'http://example.com/index.html?abc=def&def=abc';
  const query = {one: 'two', two: 'one'};
  await browser.makeRequest(rMethod, url, query);
});
