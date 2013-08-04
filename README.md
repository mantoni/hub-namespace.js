# hub-namespace.js [![Build Status](https://secure.travis-ci.org/mantoni/hub-namespace.js.png?branch=master)](http://travis-ci.org/mantoni/hub-namespace.js) [![NPM version](https://badge.fury.io/js/hub-namespace.png)](http://badge.fury.io/js/hub-namespace)

Namespaces for hub.js

Repository: <https://github.com/mantoni/hub-namespace.js>

---

## Install with npm

```
npm install hub-namespace
```

## For browsers

Use [Browserify](http://browserify.org) to create a custom bundle.


## Development

Here is what you need:

 - `npm install` will install all the dev dependencies
 - `make` does all of the following
 - `make lint` lint the code with JSLint
 - `make test` runs all unit tests in Node
 - `make browser` generates a static web page at `test/all.html` to run the tests in a browser
 - `make phantom` runs all tests in a [headless WebKit](http://phantomjs.org/). Make sure `phantomjs` is in your path.

To build a standalone browserified file with the merged / minified scripts run `make package`.
