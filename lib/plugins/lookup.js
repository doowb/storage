'use strict';

var utils = require('../utils');

module.exports = function(proto) {

  /**
   * Find a item by `name`, optionally passing a `collection` to limit
   * the search. If no collection is passed all `renderable` collections
   * will be searched.
   *
   * ```js
   * var product = app.find('my-product');
   *
   * // optionally pass a collection name as the second argument
   * var product = app.find('my-product', 'products');
   * ```
   * @name .find
   * @param {String} `name` The name/key of the item to find
   * @param {String} `colleciton` Optionally pass a collection name (e.g. products)
   * @return {Object|undefined} Returns the item if found, or `undefined` if not.
   * @api public
   */

  proto.find = function(name, collection) {
    if (typeof name !== 'string') {
      throw new TypeError('expected name to be a string.');
    }

    if (typeof collection === 'string') {
      if (this.items.hasOwnProperty(collection)) {
        return this[collection].getItem(name);
      }
      throw new Error('collection ' + collection + ' does not exist');
    }

    for (var key in this.items) {
      var items = this.items[key];
      if (name in items) {
        return items[name];
      }

      var item = this.getItem(items, name);
      if (item) {
        return item;
      }
    }
  };

  /**
   * Get item `key` from the specified `collection`.
   *
   * ```js
   * var item = app.getItem('products', 'a/b/c');
   *
   * // optionally pass a `renameKey` function to modify the lookup
   * var item = app.getItem('products', 'a/b/c', function(fp) {
   *   return path.basename(fp);
   * });
   * ```
   * @name .getItem
   * @param {String} `collection` Collection name, e.g. `products`
   * @param {String} `key` Template name
   * @param {Function} `fn` Optionally pass a `renameKey` function
   * @return {Object}
   * @api public
   */

  proto.getItem = function(collection, key, fn) {
    var items = this.getCollection(collection);
    // use custom renameKey function
    if (typeof fn === 'function') {
      key = fn.call(this, key);
    }
    if (items.hasOwnProperty(key)) {
      return items[key];
    }
    // try again with the default renameKey function
    var name = this.option('renameKey').call(this, key);
    if (name && name !== key && items.hasOwnProperty(name)) {
      return items[name];
    }
  };

  /**
   * Get all items from a `collection` using the collection's
   * singular or plural name.
   *
   * ```js
   * var products = app.getCollection('products');
   * //=> { products: {'home.hbs': { ... }}
   *
   * var posts = app.getCollection('posts');
   * //=> { posts: {'2015-10-10.md': { ... }}
   * ```
   *
   * @name .getCollection
   * @param {String} `name` The collection name, e.g. `products` or `product`
   * @return {Object}
   * @api public
   */

  proto.getCollection = function(name) {
    var orig = name;
    if (utils.isObject(name)) return name;
    if (!this.items.hasOwnProperty(name)) {
      name = this.inflections[name];
    }
    if (!this.items.hasOwnProperty(name)) {
      throw new Error('getCollection cannot find collection: ' + orig);
    }
    return this.items[name];
  };
};
