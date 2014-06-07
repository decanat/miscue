/**
 * Load dependencies
 */

var extend = require('extend');


/**
 * HTTP status codes as sections
 */

var statusCodes = {
        1: 'informational',
        2: 'success',
        3: 'redirection',
        4: 'client error',
        5: 'server error'
    };

// var statusSummary = {
//         100: "Client should continue with request",
//         101: "Server is switching protocols",
//         102: "Server has received and is processing the request",
//         103: "resume aborted PUT or POST requests",
//         122: "URI is longer than a maximum of 2083 characters",
//         200: "standard response for successful HTTP requests",
//         201: "request has been fulfilled;  new resource created",
//         202: "request accepted, processing pending",
//         203: "request processed, information may be from another source",
//         204: "request processed, no content returned",
//         205: "request processed, no content returned, reset document view",
//         206: "partial resource return due to request header",
//         207: "XML, can contain multiple separate responses",
//         208: "results previously returned ",
//         226: "request fulfilled, reponse is instance-manipulations",
//         300: "multiple options for the resource delivered",
//         301: "this and all future requests directed to the given URI",
//         302: "temporary response to request found via alternative URI",
//         303: "permanent response to request found via alternative URI",
//         304: "resource has not been modified since last requested",
//         305: "content located elsewhere, retrieve from there",
//         306: "subsequent requests should use the specified proxy",
//         307: "connect again to different URI as provided",
//         308: "connect again to a different URI using the same method",
//         400: "request cannot be fulfilled due to bad syntax",
//         401: "authentication is possible but has failed ",
//         402: "payment required, reserved for future use",
//         403: "server refuses to respond to request",
//         404: "requested resource could not be found",
//         405: "request method not supported by that resource",
//         406: "content not acceptable according to the Accept headers",
//         407: "client must first authenticate itself with the proxy",
//         408: "server timed out waiting for the request",
//         409: "request could not be processed because of conflict",
//         410: "resource is no longer available and will not be available again",
//         411: "request did not specify the length of its content",
//         412: "server does not meet request preconditions",
//         413: "request is larger than the server is willing or able to process",
//         414: "URI provided was too long for the server to process",
//         415: "server does not support media type",
//         416: "client has asked for unprovidable portion of the file",
//         417: "server cannot meet requirements of Expect request-header field",
//         418: "I'm a teapot",
//         420: "Twitter rate limiting",
//         422: "request unable to be followed due to semantic errors",
//         423: "resource that is being accessed is locked",
//         424: "request failed due to failure of a previous request",
//         426: "client should switch to a different protocol",
//         428: "origin server requires the request to be conditional",
//         429: "user has sent too many requests in a given amount of time",
//         431: "server is unwilling to process the request",
//         444: "server returns no information and closes the connection",
//         449: "request should be retried after performing action",
//         450: "Windows Parental Controls blocking access to webpage",
//         451: "The server cannot reach the client's mailbox.",
//         499: "connection closed by client while HTTP server is processing",
//         500: "generic error message",
//         501: "server does not recognise method or lacks ability to fulfill",
//         502: "server received an invalid response from upstream server",
//         503: "server is currently unavailable",
//         504: "gateway did not receive response from upstream server",
//         505: "server does not support the HTTP protocol version",
//         506: "content negotiation for the request results in a circular reference",
//         507: "server is unable to store the representation",
//         508: "server detected an infinite loop while processing the request",
//         509: "bandwidth limit exceeded",
//         510: "further extensions to the request are required",
//         511: "client needs to authenticate to gain network access",
//         598: "network read timeout behind the proxy ",
//         599: "network connect timeout behind the proxy"
//     };


/**
 * Creates a new Miscue object
 *
 * @constructor
 * @property {Number} code
 * @property {*} data Additional details to store
 *
 * @param {Number} code
 * @param {*} [data]
 *
 * @return {Object}
 */

function Miscue(code, data) {
    this.code = code || 0;
    this.data = data;

    this.set(code);

    return this;
}


/**
 * Set `code`, with optional `name`.
 * Automatically marks 4xx and 5xx as Error.
 *
 * @param {Number} code
 * @param {String} [name]
 */

Miscue.prototype.set = function(code, name) {
    if (!code) return this;

    if (isType(code, 'string')) {
        var c = parseInt(code, 10);
        // in case of `code === '200'`
        if (isType(c, 'number')) code = c;
        // in case of `code === 'no response'`
        if (isType(c, 'NaN')) name = code, code = this.code;
    }

    // first digit of xxx
    var cxx = code / 100 | 0;

    this.code = code;
    this.name = name || statusCodes[cxx] || 'miscue';

    // get 0 (false) on 4 and 5
    (cxx - 4.5 | 0) || this.turnError();

    return this;
};


/**
 * Check whether `Miscue#name` is the given string
 * or satisfies given regex.
 *
 * @param {String|RegExp} name
 * @return {Boolean}
 */

Miscue.prototype.is = function(name) {
    if (isType(name, 'regex'))
        return name.test(this.name);

    return name === this.name;
};


/**
 * Make it simulate native Error behavior
 *
 *     var m = new Miscue(1026, 'duplicate entry');
 *     m.turnError();
 *     m instanceof Error; // true
 *
 * @return {Object}
 */

Miscue.prototype.turnError = function(){
    var proto = this,
        parent = this.__proto__;

    // cache all custom functionality
    var cache = {};

    // something like a bad hack
    do {
        for (var name in proto) {
            if (cache.hasOwnProperty(name)) continue;
            cache[name] = proto[name];
        }
    } while (proto = proto.__proto__);

    // hide current function from stack, if possible
    if (isType(Error.captureStackTrace, 'function')) {
        Error.captureStackTrace(this, this.turnError);
    }
    // make it Error
    this.__proto__ = new Error;

    // append
    for (var name in cache) {
        if (!cache.hasOwnProperty(name)) continue;
        this[name] = cache[name];
    }

    // save parent
    this.__super__ = parent;

    return this;
};


/**
 * Return better semantics
 * while being treated as string
 *
 *     var m = new Miscue(201);
 *     m + ''; // "success (201)"
 *
 * @return {String}
 */

Miscue.prototype.toString = function(){
    var message = this.name + ' (' + this.code + ')',
        details = serialize(this.data);

    function serialize(o) {
        if (!o) return '';

        return isType(o, 'object')
            ? JSON.stringify(o)
            : o.toString();
    }

    return details
        ? message + ': ' + details
        : message;
};


/**
 * Expose
 */

module.exports = Miscue;


/**
 * Make it "extendable"
 */

module.exports.extend = extend;


/**
 * Returns type of given value,
 * or, if expected type is supplied as second argument,
 * compares and returns boolean.
 *
 * @returns {String|Boolean}
 */

function isType(o, expected) {
    var toString = Object.prototype.toString,
        actual;

    actual = toString
        .call(o)
        .replace(/^\[object (\w+)\]$/i, '$1')
        .toLowerCase();

    expected = arguments.length === 1
        ? false
        : expected.toLowerCase();

    if (actual === 'number' && isNaN(o))
        actual = 'nan';

    return expected
        ? !actual.indexOf(expected)
        : actual;
}

// function isNumber()
