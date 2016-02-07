'use strict';

var Storage = require('../');
var storage = new Storage();

storage.create('product');
storage.product('foo', {bar: 'baz'});
console.log(storage);
