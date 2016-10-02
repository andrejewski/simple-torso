import test from 'ava';
import {Session, Webview} from '../lib/';

test('createWebview() should return a webview', t => {
  const session = new Session();
  const webview = session.createWebview();
  t.true(webview instanceof Webview);
});
