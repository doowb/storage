'use strict';

var Base = require('base');

/**
 * Expose `StorageBase`
 */

module.exports = StorageBase;

/**
 * Inherit `Base`. This class is used to provide baseline
 * methods for all classes on the storage API.
 *
 * ```js
 * function App() {
 *   Base.call(this);
 * }
 * Base.extend(App);
 * ```
 */

function StorageBase() {
  Base.apply(this, arguments);
  this.use(require('base-plugins')());
  this.use(require('base-options')());
}

/**
 * Inherit `Base`
 */

Base.extend(StorageBase);
