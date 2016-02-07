'use strict';

var utils = require('../utils');

/**
 * Default methods and settings that will be decorated onto
 * each collection.
 */

module.exports = function(app, collection, options) {

  // decorate `extendItem` onto the collection
  collection.extendItem = app.extendItem.bind(app);

  // bubble up custom collection events, like `app.on('product', ...)`
  var inflection = collection.options.inflection;
  if (inflection) {
    collection.on(inflection, function() {
      app.emit.bind(app, inflection).apply(app, arguments);
    });
  }

  // bubble up `item` events
  collection.on('item', function(item, collectionName, collection) {
    utils.define(item, 'addItem', collection.addItem.bind(collection));
    item.provider = collection.options.provider || item.provider;
    app.extendItem(item, options);
  });

  collection.on('load', function(item, collectionName, collection) {
    app.emit.bind(app, 'item').apply(app, arguments);
  });
};
