// adapted from https://docs.djangoproject.com/en/dev/ref/csrf/

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

function setTokenHeader (httpServiceName, httpServiceObject, cookieName = "csrftoken") {
    const HEADER_NAME = "X-CSRFToken"
    const COOKIE_NAME = cookieName
    
    const TOKEN = getTokenFromCookie(COOKIE_NAME)

    if (!TOKEN) {
        throw (Error("token cookie not found with name: " + COOKIE_NAME))
    }

    switch (httpServiceName) {
        case "angular":
        case "axios":
            httpServiceObject.defaults.xsrfHeaderName = HEADER_NAME
            httpServiceObject.defaults.xsrfCookieName = COOKIE_NAME
            break

        case "jquery":
            httpServiceObject.ajaxSetup({
                beforeSend: function(xhr, settings) {
                    if (!isCsrfSafeMethod(settings.type) && !this.crossDomain) {
                        xhr.setRequestHeader(HEADER_NAME, TOKEN)
                    }
                }
            })

            break

        default: 
            throw (Error("service not supported: " + httpServiceName))
    }
}

module.exports = { getTokenFromCookie, setTokenHeader }
