import test from 'ava';
import {
  Browser,
  Session,
  Webview,
  Webpage
} from '../lib/';

test('should export Browser, Session, Webview, and Webpage', t => {
  t.truthy(Browser);
  t.truthy(Session);
  t.truthy(Webview);
  t.truthy(Webpage);
});
