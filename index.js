/*!
 * storage <https://github.com/jonschlinkert/storage>
 *
 * Copyright (c) 2016 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var debug = require('debug')('storage');
var plugin = require('./lib/plugins/');
var utils = require('./lib/utils/');
var Base = require('./lib/base');
var lib = require('./lib/');

/**
 * Collection constructors
 */

var Collection = lib.collection;
var List = lib.list;

/**
 * Item constructors
 */

var Item = lib.item;

/**
 * This function is the main export of the storage module.
 * Initialize an instance of `storage` to create your
 * application.
 *
 * ```js
 * var storage = require('storage');
 * var app = storage();
 * ```
 * @param {Object} `options`
 * @api public
 */

function Storage(options) {
  if (!(this instanceof Storage)) {
    return new Storage(options);
  }

  this.options = options || {};
  utils.define(this, 'isStorage', true);
  debug('Initializing storage');
  this.is('Storage');

  Base.call(this);
  this.defaultConfig();
}

/**
 * Inherit `Base`
 */

Base.extend(Storage);

/**
 * Mixin static methods
 */

plugin.is(Storage);

/**
 * Mixin prototype methods
 */

plugin.collectionType(Storage.prototype);
plugin.provider(Storage.prototype);
plugin.lookup(Storage.prototype);
plugin.errors(Storage.prototype, 'Storage');

/**
 * Initialize Storage default configuration
 */

Storage.prototype.defaultConfig = function() {
  if (!this.plugins) {
    this.plugins = {};
  }

  this.use(plugin.init);
  this.use(plugin.item('item', 'Item'));

  this.inflections = {};
  this.collections = {};

  for (var key in this.options.mixins) {
    this.mixin(key, this.options.mixins[key]);
  }

  // listen for options events
  this.listen(this);

  // expose constructors on the instance
  this.expose('Base');
  this.expose('Item');
  this.expose('List');
  this.expose('Collection');
};

/**
 * Expose constructors on app instance.
 */

Storage.prototype.expose = function(name) {
  this.define(name, this.options[name] || lib[name.toLowerCase()]);
};

/**
 * Listen for events
 */

Storage.prototype.listen = function(app) {
  this.on('option', function(key, value) {
    utils.updateOptions(app, key, value);
  });
};

/**
 * Create a new list. See the [list docs](docs/lists.md) for more
 * information about lists.
 *
 * ```js
 * var list = app.list();
 * list.addItem('abc', {});
 *
 * // or, create list from a collection
 * app.create('products');
 * var list = app.list(app.products);
 * ```
 * @param  {Object} `opts` List options
 * @return {Object} Returns the `list` instance for chaining.
 * @api public
 */

Storage.prototype.list = function(opts) {
  opts = opts || {};

  if (!opts.isList) {
    utils.defaults(opts, this.options);
  }

  var List = opts.List || this.get('List');
  var list = {};

  if (opts.isList === true) {
    list = opts;
  } else {
    opts.Item = opts.Item || this.get('Item');
    list = new List(opts);
  }

  // customize list items
  this.extendCollection(list, opts);

  // emit the list
  this.emit('list', list, opts);
  return list;
};

/**
 * Create a new collection. Collections are decorated with
 * special methods for getting and setting items from the
 * collection. Note that, unlike the [create](#create) method,
 * collections created with `.collection()` are not cached.
 *
 * See the [collection docs](docs/collections.md) for more
 * information about collections.
 *
 * @param  {Object} `opts` Collection options
 * @return {Object} Returns the `collection` instance for chaining.
 * @api public
 */

Storage.prototype.collection = function(opts, created) {
  opts = opts || {};

  if (!opts.isCollection) {
    utils.defaults(opts, this.options);
  }

  var Collection = opts.Collection || this.get('Collection');
  var collection = {};

  if (opts.isCollection === true) {
    collection = opts;
  } else {
    opts.Item = opts.Item || this.get('Item');
    collection = new Collection(opts);
  }

  if (created !== true) {
    // run collection plugins
    this.run(collection);

    // emit the collection
    this.emit('collection', collection, opts);
    this.extendCollection(collection, opts);

    // // add collection and view helpers
    // helpers(this, opts);
  } else {

    // emit the collection
    this.emit('collection', collection, opts);
  }
  return collection;
};

/**
 * Create a new collection to be stored on the `app.collections` object. See
 * the [create docs](docs/collections.md#create) for more details.
 *
 * @param  {String} `name` The name of the collection to create. Plural or singular form may be used, as the inflections are automatically resolved when the collection
 * is created.
 * @param  {Object} `opts` Collection options
 * @return {Object} Returns the `collection` instance for chaining.
 * @api public
 */

Storage.prototype.create = function(name, opts) {
  debug('creating collection: "%s"', name);
  opts = opts || {};

  if (!opts.isCollection) {
    utils.defaults(opts, this.options);
  }

  var collection = this.collection(opts, true);

  // get the collection inflections, e.g. page/pages
  var single = utils.single(name);
  var plural = utils.plural(name);

  // map the inflections for lookups
  this.inflections[single] = plural;

  // add inflections to collection options
  collection.option('inflection', single);
  collection.option('plural', plural);

  // prime the collectionType(s) for the collection
  this.collectionType(plural, collection.collectionType());

  // add the collection to `app.collections`
  this.collections[plural] = collection.items;

  // create loader functions for adding items to this collection
  this.define(plural, function() {
    return collection.addItems.apply(collection, arguments);
  });
  this.define(single, function() {
    return collection.addItem.apply(collection, arguments);
  });

  /* eslint-disable no-proto */
  // decorate loader methods with collection methods
  this[plural].__proto__ = collection;
  this[single].__proto__ = collection;

  // create aliases on the collection for addItem/addItems
  // to support chaining
  collection.define(plural, this[plural]);
  collection.define(single, this[single]);

  // run collection plugins
  this.run(collection);

  // emit create
  this.emit('create', collection, opts);
  this.extendCollection(collection, opts);

  // add collection and view helpers
  // helpers(this, opts);
  return collection;
};

/**
 * Decorate or override methods on an item created by a collection.
 */

Storage.prototype.extendItem = function(item, options) {
  plugin.item(this, item, options);
  return this;
};

/**
 * Decorate or override methods on a collection instance.
 */

Storage.prototype.extendCollection = function(collection, options) {
  plugin.collection(this, collection, options);
  return this;
};

/**
 * Expose constructors as static methods.
 */

Storage.Base = Base;
Storage.Item = Item;
Storage.List = List;
Storage.Collection = Collection;

/**
 * Expose package metadata
 */

utils.define(Storage, 'meta', require('./package'));

/**
 * Expose properties for unit tests
 */

utils.define(Storage, 'utils', utils);
utils.define(Storage, '_', {lib: lib, plugin: plugin});

/**
 * Expose `Storage`
 */

module.exports = Storage;
