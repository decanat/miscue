var extend = require('yiwn-extend');

/**
 * Expose
 */

module.exports = Miscue;

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
 * Map for symbolic representations.
 */

var signMap = {
        0: '•',
        2: '✔',
        3: '➤',
        4: '✖',
        5: '✖'
    };

/**
 * Creates a new Miscue object
 *
 * @constructor
 * @param {Number} code
 * @param {Mixed} data [optional]
 * @return {Object}
 */

function Miscue(code, data) {
    if (!(this instanceof Miscue))
        return new Miscue(code, data);

    return this.initialize(code, data);
}


/**
 * Setup with provided arguments.
 *
 * @param {Number|String} code
 * @param {Mixed} data [optional]
 * @return {Miscue}
 * @api private
 */

Miscue.prototype.initialize = function(code, data){
    this.code = code || 0;
    this.data = data;

    this.set(code);

    return this;
};


/**
 * Set `code`, with optional `name`.
 * Automatically marks 4xx and 5xx as Error.
 *
 * @param {Number|String} code
 * @param {String} name [optional]
 * @return {Miscue}
 * @api public
 */

Miscue.prototype.set = function(code, name) {
    if (!code) return this;

    if (typeof code == 'string') {
        var c = parseInt(code, 10);

        if (isNaN(c))
            name = code, code = this.code;
        else code = c;
    }

    var cxx = fft(code);

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
 * @api public
 */

Miscue.prototype.is = function(name) {
    if (name instanceof RegExp)
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
 * @api public
 */

Miscue.prototype.turnError = function(){
    // cache all functionality
    var proto = this.__proto__;

    Error.call(this);

    // hide current function from stack, if possible
    if (Error.captureStackTrace)
        Error.captureStackTrace(this, this.turnError);

    // make it Error
    this.__proto__ = new Error;

    // append
    extend(this, proto, true);

    return this;
};


/**
 * Return better semantics
 * while being treated as string
 *
 *     var m = new Miscue(201);
 *     m + ''; // "✔ success (201)"
 *
 * @return {String}
 * @api public
 */

Miscue.prototype.toString = function(){
    var ccx = fft(this.code),
        pre = signMap[ccx] || signMap[0];

    if (this instanceof Error)
        pre = signMap[4];

    return pre + ' ' + this.name + ' (' + this.code + ')';
};


/**
 * Return first digit of xxx.
 *
 * @param  {Number} code
 * @return {Number}
 * @api private
 */

function fft(code) {
    if (!code)
        return 0;
    return code / 100 | 0;
}
