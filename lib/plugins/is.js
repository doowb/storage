'use strict';

var utils = require('../utils');

/**
 * This plugin decorates static methods onto a class, `Storge`,
 * for doing instance checks.
 */

module.exports = function(Storge) {
  if (!Storge) return;

  /**
   * Static method that returns true if the given value is
   * a `storage` instance (`Storge`).
   *
   * ```js
   * var storage = require('storage');
   * var app = storage();
   *
   * storage.isStorage(storage);
   * //=> false
   *
   * storage.isStorage(app);
   * //=> true
   * ```
   * @param {Object} `val` The value to test.
   * @return {Boolean}
   * @api public
   */

  utils.define(Storge, 'isStorage', function isStorage(val) {
    return utils.isObject(val) && val.isStorage === true;
  });

  /**
   * Static method that returns true if the given value is
   * a storage `Collection` instance.
   *
   * ```js
   * var storage = require('storage');
   * var app = storage();
   *
   * app.create('pages');
   * storage.isCollection(app.pages);
   * //=> true
   * ```
   * @param {Object} `val` The value to test.
   * @return {Boolean}
   * @api public
   */

  utils.define(Storge, 'isCollection', function isCollection(val) {
    return utils.isObject(val) && val.isCollection === true;
  });

  /**
   * Static method that returns true if the given value is
   * a storage `List` instance.
   *
   * ```js
   * var storage = require('storage');
   * var List = storage.List;
   * var app = storage();
   *
   * var list = new List();
   * storage.isList(list);
   * //=> true
   * ```
   * @param {Object} `val` The value to test.
   * @return {Boolean}
   * @api public
   */

  utils.define(Storge, 'isList', function isList(val) {
    return utils.isObject(val) && val.isList === true;
  });

  /**
   * Static method that returns true if the given value is
   * a storage `View` instance.
   *
   * ```js
   * var storage = require('storage');
   * var app = storage();
   *
   * storage.isItem('foo');
   * //=> false
   *
   * var view = app.view('foo', {content: '...'});
   * storage.isItem(view);
   * //=> true
   * ```
   * @param {Object} `val` The value to test.
   * @return {Boolean}
   * @api public
   */

  utils.define(Storge, 'isItem', function isItem(val) {
    return utils.isObject(val) && val.isItem === true;
  });
};

