'use strict';

var Base = require('base').namespace('cache');

function Collection(name, options) {
  if (!(this instanceof Collection)) {
    return new Collection(options);
  }

  this.name = name;
  this.options = options || {};
  Base.call(this);
  this.define('collections', {});
}

Base.extend(Collection);

Collection.prototype.get = function(key, cb) {
  cb(null, this._parent_.get.call(this, key));
};

Collection.prototype.find = function(key, cb) {
  cb(new Error('.find not implemented'));
};

Collection.prototype.set = function(key, val, cb) {
  if (typeof val === 'function') {
    cb = val;
    val = null;
  }

  var args = [key];
  if (val !== null && typeof val !== 'undefined') {
    args.push(val);
  }
  this._parent_.set.apply(this, args);
  cb(null);
};

Collection.prototype.del = function(key, cb) {
  cb(null, new Error('.del not implemented'));
};

module.exports = Collection;
