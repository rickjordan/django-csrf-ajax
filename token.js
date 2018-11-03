// adapted from https://docs.djangoproject.com/en/dev/ref/csrf/

const defaults = {
    HEADER_NAME: "X-CSRFToken",
    COOKIE_NAME: "csrftoken"
}

function getTokenFromCookie(cookieName) {
    let token = null

    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';')

        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim()
            
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
    const token = getTokenFromCookie(defaults.COOKIE_NAME)

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
