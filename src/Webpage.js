import url from 'url';
import cheerio from 'cheerio';

export default class Webpage {
  constructor(webview, response) {
    this._webview = webview;
    this._response = response;
  }

  getWebview() {return this._webview;}
  getResponse() {return this._response;}

  getPath() {
    return this.getResponse().url;
  }

  getPathname() {
    return url.parse(this.getPath()).pathname;
  }

  getQueryParams() {
    return url.parse(this.getPath(), true).query;
  }

  resolveUrl(segment) {
    // _url contains the full path
    return url.resolve(this.getResponse()._url, segment);
  }

  getStatusCode() {
    return this.getResponse().statusCode;
  }

  getDocumentTitle() {
    return this.$('title').text();
  }

  _createDocument() {
    const html = this.getResponse().body;
    const self = this;
    const document = cheerio.load(html);

    document.prototype.submit = function submit() {
      return self._submit(this);
    };
    document.prototype.click = function click() {
      return self._click(this);
    };
    return document;
  }

  _click(el) {
    if (el.is('a')) {
      const href = el.attr('href');
      if (href.startsWith('#')) {
        return Promise.resolve();
      }
      const url = this.resolveUrl(href);
      return this.getWebview().goto(url);
    }

    if (el.is('input[type=submit]')) {
      return el.submit();
    }

    const error = new Error('Effects of .click() are not fully implemented.');
    return Promise.reject(error);
  }

  _submit(el) {
    const form = el.is('form') ? el : el.parent('form');
    if (!form.length) {
      const error = new Error('Form not found to submit');
      return Promise.reject(error);
    }

    const body = form.serializeArray().reduce((body, pair) => {
      const [name, value] = pair;
      body[name] = value;
      return body;
    }, {});
    const action = form.attr('action');
    const url = action ? this.resolveUrl(action) : this.getUrl();
    const webview = this.getWebview();
    const method = form.attr('method') || 'get';
    return method === 'get'
      ? webview.goto(url, body)
      : webview.send(method, url, body);
  }

  $(...args) {
    if (!this._document) {
      // lazily created because not every page needs it
      this._document = this._createDocument();
    }
    return this._document(...args);
  }
}
