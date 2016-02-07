'use strict';

/**
 * Lazily required module dependencies
 */

/* eslint-disable no-native-reassign */
var utils = require('lazy-cache')(require);
var fn = require;
/* eslint-disable no-undef */
require = utils;

/**
 * Plugins for [base](https://github.com/node-base/base)
 */

require('base-data');
require('base-option', 'option');

/**
 * Common utils
 */

require('array-sort', 'sortBy');
require('clone');
require('deep-bind', 'bindAll');
require('define-property', 'define');
require('extend-shallow', 'extend');
require('get-view');
require('group-array', 'groupBy');
require('has-glob');
require('match-file');
require('mixin-deep', 'merge');
require('paginationator');
require('word-wrap', 'wrap');

/**
 * Engines, templates, helpers and related utils
 */

require('inflection', 'inflect');
require('template-error', 'rethrow');
require = fn;

/**
 * Expose utils
 */

module.exports = utils;
