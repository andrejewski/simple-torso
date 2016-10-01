import qs from 'querystring';
import request from 'request';
import Session from './Session';

export default class Browser {
  constructor(options = {}) {
    const {baseUrl, userAgent} = options;
    if (baseUrl) this.baseUrl(baseUrl);
    if (userAgent) this.userAgent(userAgent);
    this._sessions = [];
  }

  createSession() {
    const session = new Session(this);
    this._sessions.push(session);
    return session;
  }

  createWebview() {
    const session = this.createSession();
    const webview = session.createWebview();
    return webview;
  }

  baseUrl(newBaseUrl) {
    if (newBaseUrl) {
      const isHttp = newBaseUrl.startsWith('http://');
      const isHttps = newBaseUrl.startsWith('https://');
      if (!(isHttp || isHttps)) {
        throw new Error('Base urls must begin with http:// or https://');
      }
      this._baseUrl = newBaseUrl;
    }
    return this._baseUrl;
  }

  userAgent(newUserAgent) {
    if (newUserAgent) {
      this._userAgent = newUserAgent;
    }
    return this._userAgent;
  }

  makeRequest(method, url, query = {}, body = {}, headers = {}, jar) {
    if (method !== method.toLowerCase().trim()) {
      throw new Error(`Method "${method}" is invalid and/or needs trimmed.`);
    }
    if (url.charAt(0) === '/') {
      const baseUrl = this.browser.baseUrl();
      if (!baseUrl) {
        throw new Error(`Url "${url}" needs a hostname (use baseUrl()).`);
      }
      url = `${baseUrl}${url}`;
    }
    // peel off url query for sanity
    const queryStart = url.lastIndexOf('?');
    if (queryStart !== -1) {
      const querystring = url.slice(queryStart);
      query = Object.assign(qs.parse(querystring), query);
      url = url.slice(0, queryStart - 1);
    }
    return this._makeRequest(method, url, query, body, headers, jar);
  }

  _makeRequest(method, url, query, body, headers, jar) {
    // this is broken up for testing
    return new Promise((resolve, reject) => {
      request({
        method,
        qs: query,
        form: body,
        headers,
        jar
      }, (error, response, body) => {
        if (error) return reject(error);
        response.body = body;
        resolve(response);
      });
    });
  }
}
