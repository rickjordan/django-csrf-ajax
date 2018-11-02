const chai = require('chai'), expect = chai.expect, should = chai.should()
const jsdom = require("jsdom")
const setTokenHeader = require('./token.js')

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
    const cookies = new jsdom.CookieJar();
    const tokenCookie = new jsdom.toughCookie.Cookie({
        key: "csrftoken",
        value: token
    })
    
    cookies.setCookie(tokenCookie, "", function() {})
    
    const dom = new jsdom.JSDOM(``, { cookies })
    global.document = dom.window.document

    return dom
}

// angular
describe('angular', function() {
    const token = generateToken()
    setupDom(token)
    
    it('sets token header without error') // TODO

    it('includes token header in post request') // TODO
})

// axios
describe('axios', function() {
    const token = generateToken()
    setupDom(token)

    const axios = require('axios')
    
    it('sets token header without error', function() {
        (function() {
            setTokenHeader('axios', axios)
        }).should.not.throw(Error)
    })

    it('includes token header in post request') // TODO
})

// jquery
describe('jquery', function() {
    const token = generateToken()
    const dom = setupDom(token)
    const $ = require('jquery')(dom.window)
    
    it('sets token header without error', function() {
        (function() {
            setTokenHeader('jquery', $)
        }).should.not.throw(Error)
    })

    it('includes token header in post request') // TODO
})
