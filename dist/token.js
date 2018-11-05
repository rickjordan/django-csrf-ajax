(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.token = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// adapted from https://docs.djangoproject.com/en/dev/ref/csrf/

var defaults = {
    HEADER_NAME: "X-CSRFToken",
    COOKIE_NAME: "csrftoken"
}

function getTokenFromCookie(cookieName) {
    var token = null

    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';')

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim()
            
            if (cookie.substring(0, cookieName.length + 1) === (cookieName + '=')) {
                token = decodeURIComponent(cookie.substring(cookieName.length + 1))
                break
            }
        }
    }

    return token
}

function isCsrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method))
}

function setTokenHeader (httpServiceName, httpServiceObject) {
    var token = getTokenFromCookie(defaults.COOKIE_NAME)

    if (!token) {
        throw (Error("token cookie not found with name: " + defaults.COOKIE_NAME))
    }

    switch (httpServiceName) {
        case "angular":
        case "axios":
            httpServiceObject.defaults.headers.post[defaults.HEADER_NAME] = token;
            httpServiceObject.defaults.headers.put[defaults.HEADER_NAME] = token;
            httpServiceObject.defaults.headers.patch[defaults.HEADER_NAME] = token;
            httpServiceObject.defaults.headers.delete[defaults.HEADER_NAME] = token;
            break

        case "jquery":
            httpServiceObject.ajaxSetup({
                beforeSend: function(xhr, settings) {
                    if (!isCsrfSafeMethod(settings.type) && !this.crossDomain) {
                        xhr.setRequestHeader(defaults.HEADER_NAME, token)
                    }
                }
            })

            break

        default: 
            throw (Error("service not supported: " + httpServiceName))
    }
}

module.exports = { getTokenFromCookie, setTokenHeader, defaults }

},{}]},{},[1])(1)
});
