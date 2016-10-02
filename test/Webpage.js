import test from 'ava';
import {Webpage} from '../lib/';

const exampleRes = {
  _url: 'http://example.com/index.html',
  url: '/index.html?abc=def&def=abc',
  statusCode: 200,
  body: `
    <html>
      <head>
        <title>Example Response</title>
      </head>
      <body>
        <h1>Example</h1>
      </body>
    </html>
  `
};

test('getPath() should alias response.url', t => {
  const webpage = new Webpage(null, exampleRes);
  t.is(webpage.getPath(), exampleRes.url);
});

test('getPathname() should return the url path name', t => {
  const webpage = new Webpage(null, exampleRes);
  t.is(webpage.getPathname(), '/index.html');
});

test('getQueryParams() should return the url query parameters', t => {
  const webpage = new Webpage(null, exampleRes);
  t.deepEqual(webpage.getQueryParams(), {abc: 'def', def: 'abc'});
});

test('resolveUrl() should resolve a url based on the webpage url', t => {
  const webpage = new Webpage(null, exampleRes);
  const relative = 'about.html';
  t.is(webpage.resolveUrl(relative), 'http://example.com/about.html');

  const absolute = 'http://example.com/';
  t.is(webpage.resolveUrl(absolute), absolute);
});

test('getStatusCode() should return the status code', t => {
  const webpage = new Webpage(null, exampleRes);
  t.is(webpage.getStatusCode(), 200);
});

test('getDocumentTitle() should return the title', t => {
  const webpage = new Webpage(null, exampleRes);
  t.is(webpage.getDocumentTitle(), 'Example Response');
});

test('$() should expose cheerio on the response body', t => {
  const webpage = new Webpage(null, exampleRes);
  t.is(webpage.$('h1').text(), 'Example');
});
