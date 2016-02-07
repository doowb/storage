'use strict';

var utils = require('../utils');

/**
 * Common properties that need to be initialized on the storage instance,
 * and/or other instances.
 */

module.exports = function(app) {
  app.cache = {};
  app.cache.data = {};

  // prime `_`
  if (!app._) utils.define(app, '_', {});

  app.providers = {};
  app._.providers = app.providers;

  app.collectionTypes = {
    collection: []
  };

  app.define('storageErrors', {
    // compile: {
    //   callback: 'is sync and does not take a callback function',
    //   engine: 'cannot find an engine for: %s',
    //   method: 'expects providers to have a compile method'
    // },
    // render: {
    //   callback: 'is async and expects a callback function',
    //   engine: 'cannot find an engine for: %s',
    //   method: 'expects providers to have a render method'
    // },
    // layouts: {
    //   notfound: 'layout "%s" was defined on view "%s" but cannot be not found (common causes are incorrect glob patterns, renameKey function modifying the key, and typos in search pattern)',
    //   registered: 'layout "%s" was defined on view "%s" but no layouts are registered'
    // }
  });
};
