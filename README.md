# Simple Torso
Super dumb headless browser for Node

**Experimental: Do not use.**

```sh
npm install simple-torso
```

Simple Torso is a headless browser designed for running very simple automated browsing tasks without the need to spin up an actual browser or something like Selenium/Phantom. Places where you might use Torso are static, no-script webpages where all you need to do is follow links, fill inputs, and submit forms without file uploads.

Simple Torso allows you to create multiple browsers, sessions, web views (like separate tabs within a browser window) and provides a simple way to navigate and interact with the webpages via `cheerio`.

## Examples

### Top Google Result
Here we visit Google, enter our `search`, and submit the form. We are then taken to the search results and simple pick the first link in the `#search` container.

```js
import {Browser} from 'simple-torso';
const browser = new Browser();

async function getTopGoogleResult(search) {
  const webview = browser.createWebview();
  await webview.goto('http://google.com');

  webview.$('input[name=q]').val(search);
  await webview.$('form[name=f]').submit();

  const link = webview.$('#search a').attr('href');
  return link;
}
```

### Facebook login then delete account
Here we realize Facebook is rotting our soul from the inside. We visit Facebook, login as the husk of a person we once were, and then navigate to the Delete Account page. We click the delete account button then go on trying to rebuild the personal connections we destroyed trying to be something we would only grow to hate.

```js
/*
  NOTE: this is a dramatization.
  Facebook makes heavy use of JavaScript so most functionality would be broken.
  Even if it wasn't, Facebook does not make it easy to truly delete your account.
*/
import {Browser} from 'simple-torso';
const browser = new Browser();

// here we set baseUrl to be DRY
// all web views share this base url
browser.baseUrl('http://facebook.com');

async function deleteFacebook(email, password) {
  const webview = browser.createWebview();
  await webview.goto('/'); // => facebook.com/

  webview.$('input[name=username]').val(email);
  webview.$('input[name=password]').val(password);
  await webview.$('#login_form').submit();

  await webview.goto('/deactivate');
  await webview.$('input[type=submit].danger').click();
}
```

## Contributing

Contributions are incredibly welcome as long as they are standardly applicable and pass the tests (or break bad ones). Tests are written in Ava.

```bash
# running tests
npm run test
```

Follow me on [Twitter](https://twitter.com/compooter) for updates or just for the lolz and please check out my other [repositories](https://github.com/andrejewski) if I have earned it. I thank you for reading.
