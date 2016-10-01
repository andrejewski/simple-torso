import url from 'url';
import cheerio from 'cheerio';

function submitAction(webpage) {
  return function _submitAction() {
    const form = this.is('form') ? this : this.parent('form');
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
    const url = action ? webpage.resolveUrl(action) : webpage.getUrl();
    const webview = webpage.getWebview();
    const method = form.attr('method') || 'get';
    return method === 'get'
      ? webview.goto(url, body)
      : webview.send(method, url, body);
  };
}

function clickAction(webpage) {
  return function _clickAction() {
    if (this.is('a')) {
      const href = this.attr('href');
      if (href.startsWith('#')) {
        return Promise.resolve();
      }
      const url = webpage.resolveUrl(href);
      return webpage.getWebview().goto(url);
    }

    if (this.is('input[type=submit]')) {
      return this.submit();
    }

    const error = new Error('Effects of .click() are not fully implemented.');
    return Promise.reject(error);
  };
}

function $(webpage) {
  const html = webpage.getResponse().body;
  const query = cheerio.load(html);

  query.prototype.submit = submitAction(webpage);
  query.prototype.click = clickAction(webpage);
  return query;
}

export default class Webpage {
  constructor(webview, response) {
    this._webview = webview;
    this._response = response;
  }

  getWebpage() {return this._webpage;}
  getResponse() {return this._response;}

  getUrl() {
    return this.getResponse().url;
  }

  getQueryParams() {
    return url.parse(this.getUrl(), true).query;
  }

  getStatusCode() {
    return this.getResponse().statusCode;
  }

  getDocumentTitle() {
    return this.$('title').text();
  }

  resolveUrl(segment) {
    return url.resolve(this.getUrl(), segment);
  }

  $(...args) {
    if (!this._document) {
      // lazily created because not every page needs it
      this._document = $(this);
    }
    return this._document(...args);
  }
}
