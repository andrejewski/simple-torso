import Webview from './Webview';
import request from 'request';

export default class Session {
  constructor(browser) {
    this._browser = browser;
    this._webviews = [];
    this._cookies = request.jar();
  }

  createWebview() {
    const webview = new Webview(this);
    this._webviews.push(webview);
    return webview;
  }

  makeRequest(...args) {
    const jar = this._cookies;
    return this._browser.makeRequest(...args, jar);
  }
}
