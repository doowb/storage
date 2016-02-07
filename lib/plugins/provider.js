'use strict';

var debug = require('debug')('storage:provider');
var utils = require('../utils');

/**
 * Expose provider utils
 */

module.exports = function(proto) {

  /**
   * Register a storage provider callback `fn`.
   *
   * ```js
   * app.provider('fs', require('storage-provider-fs'));
   *
   * // get a registered provider
   * var fs = app.provider('fs');
   * ```
   * @name .provider
   * @param {String} `name` Name of provider.
   * @param {Function|Object} `fn` or `settings`
   * @param {Object} `settings` Optionally pass provider options as the last argument.
   * @api public
   */

  proto.provider = function(name, fn, settings) {
    if (arguments.length === 1 && typeof name === 'string') {
      return this.getProvider(name);
    }
    if (typeof name !== 'string') {
      throw new TypeError('expected provider name to be a string.');
    }
    if (utils.isObject(fn) && typeof settings === 'function') {
      var tmp = fn;
      settings = fn;
      fn = tmp;
    }
    utils.arrayify(name).forEach(function(name) {
      this.setProvider(name, fn, settings);
    }.bind(this));
    return this;
  };

  /**
   * Register an provider for `name` with the given `settings`
   *
   * @param {String} `name` The provider to get.
   */

  proto.setProvider = function(name, fn, settings) {
    debug('registering provider "%s"', name);
    fn.settings = fs.settings || settings;
    this._.providers[name] = fn;
    return this;
  };

  /**
   * Get the provider settings registered for the given `name`.
   *
   * @param {String} `name` The provider to get.
   */

  proto.getProvider = function(name) {
    debug('getting provider "%s"', name);

    var provider = this._.providers[name];
    if (provider) return provider;

    name = this.option('storage provider')
      || this.option('storageProvider')
      || this.option('provider');

    return this._.providers[name];
  };
};
