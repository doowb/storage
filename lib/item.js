'use strict';

var utils = require('./utils/');
var Base = require('./base');

/**
 * Expose `Item`
 */

module.exports = Item;

/**
 * Create an instance of `Item`. Optionally pass a default object
 * to use.
 *
 * ```js
 * var item = new Item({
 *   path: 'foo.html',
 *   content: '...'
 * });
 * ```
 * @param {Object} `item`
 * @api public
 */

function Item(item) {
  if (!(this instanceof Item)) {
    return new Item(item);
  }

  this.is('Item');
  item = item || {};

  Base.call(this, item);

  for (var key in item) {
    var val = item[key];
    this.set(key, val);
  }
}

/**
 * Inherit `Base`
 */

Base.extend(Item);
