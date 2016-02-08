/*!
 * base-provider <https://github.com/node-base/base-provider>
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var Base = require('base').namespace('cache');
var utils = require('./lib/utils');
var Collection = require('./lib/collection');

/**
 * This function is the main export of the provider module.
 * Initialize an instance of `provider` to create your
 * application.
 *
 * ```js
 * var provider = require('base-provider');
 * var app = provider();
 * ```
 * @param {Object} `options`
 * @api public
 */

function Provider(options) {
  if (!(this instanceof Provider)) {
    return new Provider(options);
  }

  this.options = options || {};
  Base.call(this);
  this.define('collections', {});
  this.define('Collection', this.options.Collection || Collection);
}

/**
 * Extends Provider
 */

Base.extend(Provider);

/**
 * Gets a value from the specified collection.
 * This method should be overridden by an inheriting provider.
 *
 * @param  {String} `name` Name of the collection to use.
 * @param  {String} `key` Key of the value to get from the collection.
 * @param  {Function} `cb` Callback function that will be called with `err, results`.
 * @api public
 */

Provider.prototype.get = function(name, key, cb) {
  var collection = this.getCollection(name);
  if (!collection) {
    return cb(new Error('collection "' + name + '" not found'));
  }
  return collection.get(key, cb);
};

/**
 * Finds a value based on a lookup pattern from the specified collection.
 * This method should be overridden by an inheriting provider.
 *
 * @param  {String} `name` Name of the collection to use.
 * @param  {String|RegExp|Array} `pattern` to lookup on the collection.
 * @param  {Function} `cb` Callback function that will be called with `err, results`
 * @api public
 */

Provider.prototype.find = function(name, pattern, cb) {
  var collection = this.getCollection(name);
  if (!collection) {
    return cb(new Error('collection "' + name + '" not found'));
  }
  return collection.find(pattern, cb);
};

/**
 * Sets a value on the specified collection.
 * This method should be overridden by the inheriting provider.
 *
 * @param {String} `name` Name of the collection to use.
 * @param {String} `key` Key of the value to be set on the collection.
 * @param {*} `val` Value to be set on the collection.
 * @param {Function} `cb` Callback function that will be called with `err`
 */

Provider.prototype.set = function(name, key, val, cb) {
  if (typeof val === 'function') {
    cb = val;
    val = null;
  }

  var collection = this.getCollection(name);
  if (!collection) {
    return cb(new Error('collection "' + name + '" not found'));
  }

  var args = [key];
  if (val !== null && typeof val !== 'undefined') {
    args.push(val);
  }
  args.push(cb);
  return collection.set.apply(collection, args);
};

/**
 * Delete a value from the specified collection.
 * This method should be overridden by the inheriting provider.
 *
 * @param  {String} `name` Name of the collection to use.
 * @param  {String} `key` Key to delete from the collection.
 * @param  {Function} `cb` Callback function that will be called with `err, results`.
 * @api public
 */

Provider.prototype.del = function(name, key, cb) {
  var collection = this.getCollection(name);
  if (!collection) {
    return cb(new Error('collection "' + name + '" not found'));
  }
  return collection.del(key, cb);
};

/**
 * Create a new collection with the specified `name` and `options`.
 * This method should be overridden by the inheriting provider to add additional functionality.
 *
 * @param  {String} `name` Name of the collection to create.
 * @param  {Object} `options` Options to pass to the collection.
 * @return {Object} collection instance that was created.
 * @api public
 */

Provider.prototype.create = function(name, options) {
  var opts = utils.extend({}, options);
  var Collection = opts.Collection || this.Collection || Collection;
  var collection = new Collection(name, options);
  this.collections[name] = collection;
  return collection;
};

/**
 * Get an instance of the collection by name.
 *
 * @param  {String} `name` Name of the collection to get.
 * @return {Object} collection instance.
 * @api public
 */

Provider.prototype.getCollection = function(name) {
  return this.collections[name];
};

/**
 * Expose `Provider`
 */

module.exports = Provider;
