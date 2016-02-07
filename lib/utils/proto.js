'use strict';

var common = require('./common');
var lazy = require('./lazy');

/**
 * Expose view and collection utils
 */

var utils = module.exports;

/**
 * Return true if the given value looks like a
 * `view` object.
 */

utils.isItem = utils.isView = function(val) {
  if (!common.isObject(val)) return false;
  return val.hasOwnProperty('content')
    || val.hasOwnProperty('contents')
    || val.hasOwnProperty('path');
};

/**
 * Get locals from helper arguments.
 *
 * @param  {Object} `locals`
 * @param  {Object} `options`
 */

utils.getLocals = function(locals, options) {
  options = options || {};
  locals = locals || {};
  var ctx = {};

  if (options.hasOwnProperty('hash')) {
    lazy.extend(ctx, options.hash);
    delete options.hash;
  }
  if (locals.hasOwnProperty('hash')) {
    lazy.extend(ctx, locals.hash);
    delete locals.hash;
  }
  lazy.extend(ctx, options);
  lazy.extend(ctx, locals);
  return ctx;
};
