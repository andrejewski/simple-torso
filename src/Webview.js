import Webpage from './Webpage';

export default class Webview {
  constructor(session) {
    this._session = session;
    this._historyStack = [];
    this._historyIndex = -1;
  }

  currentWebpage() {
    return this._historyStack[this._historyIndex];
  }

  $(...args) {
    return this.currentWebpage().$(...args);
  }

  goto(url, query) {
    return this.makeRequest('get', url, query);
  }

  send(method, url, body) {
    return this.makeRequest(method, url, undefined, body);
  }

  reload() {
    const webpage = this.currentWebpage();
    const url = webpage.getUrl();
    const query = webpage.getQueryParams();

    return this.goto(url, query).then(response => {
      const newWebpage = this._historyStack.pop();
      this._historyStack.pop(); // remove old webpage
      this._historyStack.push(newWebpage);
      this._historyIndex--;
      return response;
    });
  }

  makeRequest(method, url, query, body, headers) {
    return this._session.makeRequest('get', url, query)
      .then(response => {
        const webpage = new Webpage(this, response);
        const earlyHistory = this._historyStack.slice(0, this._historyIndex);
        this._historyStack = earlyHistory.concat(webpage);
        this._historyIndex = this._historyStack.length - 1;
        return response;
      });
  }

  goBack(n = 1) {
    if (!(Number.isInteger(n) && n > 0)) {
      throw new Error(`goBack(${n}): n must be a positive integer`);
    }
    this._historyIndex = Math.max(0, this._historyIndex - n);
  }

  goForward(n = 1) {
    if (!(Number.isInteger(n) && n > 0)) {
      throw new Error(`goForward(${n}): n must be a postive integer`);
    }
    const maxIndex = this._historyStack.length - 1;
    this._historyIndex = Math.min(maxIndex, this._historyIndex + n);
  }
}
