const chai = require('chai'), expect = chai.expect
const jsdom = require("jsdom")
const { getTokenFromCookie, setTokenHeader } = require('./token.js')

const DOMAIN = "https://www.django-ajax-token.org/"
const COOKIE_NAME = "csrftoken"

function generateToken() {
    const LENGTH = 12
    const ALLOWED_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

    let token = ""

    for (let i = 0; i < LENGTH; i++) {
        token += ALLOWED_CHARS[Math.floor(Math.random() * ALLOWED_CHARS.length)]
    }

    return token
}

function setupDom(token) {
    const cookieJar = new jsdom.CookieJar();
    const cookie = new jsdom.toughCookie.Cookie({
        key: COOKIE_NAME,
        value: token,
        httpOnly: false
    })
    
    cookieJar.setCookie(cookie, DOMAIN, function() {})
    
    const dom = new jsdom.JSDOM('', {
        url: DOMAIN,
        referrer: DOMAIN,
        contentType: "text/html",
        cookieJar
    })

    global.document = dom.window.document

    return dom
}

let token, dom

beforeEach(function() {
    token = generateToken()
    dom = setupDom(token)
})

describe('general', function() {
    it('gets token from cookie', function() {
        expect(getTokenFromCookie(COOKIE_NAME)).to.equal(token)
    })
})

// angular
describe('angular', function() {
    let $httpProvider

    beforeEach(function() {
        $httpProvider = null // TODO
    })

    it('sets token header without error') // TODO

    it('includes token header in post request') // TODO
})

// axios
describe('axios', function() {
    let axios

    beforeEach(function() {
        axios = require('axios')
    })
    
    it('sets token header without error', function() {
        expect(function() { setTokenHeader('axios', axios) }).to.not.throw(Error)
    })

    it('includes token header in post request') // TODO
})

// jquery
describe('jquery', function() {
    let $

    beforeEach(function() {
        $ = require('jquery')(dom.window)
    })
    
    it('sets token header without error', function() {
        expect(function() { setTokenHeader('jquery', $) }).to.not.throw(Error)
    })

    it('includes token header in post request') // TODO
})
