# django-csrf-ajax
A JavaScript utility for acquiring and including Django's CSRF token in AJAX request headers.

Currently supports the following HTTP libraries:
* axios
* jQuery

## Installation

via [npm](https://www.npmjs.com/package/django-csrf-ajax)...
```
$ npm install django-csrf-ajax
```

## Setup

Node and CommonJS build systems...
```javascript
var token = require('django-csrf-ajax')
```

Direct browser use...
```html
<script src="./node_modules/django-csrf-ajax/dist/token.js"></script>
<script>
// access the `token` global...
</script>
```

## Setting the Token Headers

Initialize once on page load, prior to making any AJAX requests...

```javascript
// axios
var axios = require('axios')
token.setTokenHeader('axios', axios)

// jQuery
var $ = require('jquery')
token.setTokenHeader('jquery', $)
```

`django-csrf-ajax` will extract the CSRF token value from the browser's cookies and set it as a default CSRF header for all CSRF-safe request methods of the library provided (e.g., POST, PUT, PATCH, etc.).

To access the token directly...
```javascript
var csrfToken = token.getTokenFromCookie(token.defaults.COOKIE_NAME)
```

Default values can be customized prior to setting the token headers, like so...

```javascript
token.defaults = {
    HEADER_NAME: "custom-header", // default: "X-CSRFToken"
    COOKIE_NAME: "custom-cookie" // default: "csrftoken"
}
```

## Further Reading

* [Django CSRF Protection](https://docs.djangoproject.com/en/dev/ref/csrf/)
