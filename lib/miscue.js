var type = require('component-type');

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
    if (!(this instanceof Miscue))
        return new Miscue(code, data);

    this.code = code || 0;
    this.data = data;

    this.set(code);

    this.initialize.apply(this, arguments);

    return this;
}

/**
 * Boilerplate function initially,
 * is being called on instantiation,
 * so makes comfortable applying enhancements.
 */

Miscue.prototype.initialize = function(){};


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
        if (isNaN(c))
            name = code, code = this.code;
        else if
            (isType(c, 'number')) code = c;
        // in case of `code === 'no response'`
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
    // cache all functionality
    var proto = this.__proto__;

    Error.call(this);

    // hide current function from stack, if possible
    if (isType(Error.captureStackTrace, 'function'))
        Error.captureStackTrace(this, this.turnError);

    // make it Error
    this.__proto__ = new Error;

    // append
    merge(this, proto, true);

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

// * * *

/**
 * Returns type of given value,
 * or, if expected type is supplied as second argument,
 * compares and returns boolean.
 *
 * @returns {String|Boolean}
 */

function isType(o, expected) {
    var actual = type(o);

    return expected
        ? !actual.indexOf(expected)
        : actual;
}


/**
 * Merge one object with another,
 * optionally keeping attributes on first.
 *
 * @param  {Object} target
 * @param  {Object} source
 * @param  {Boolean} [optional] force
 * @return {Object}
 */

function merge(target, source, force) {
    if (!source || !isType(source, 'object'))
        return source;

    for (var attr in source) {
        if (!source.hasOwnProperty(attr)) continue;
        if (target[attr] && !force) continue;
        target[attr] = source[attr];
    }

    return target;
}
