'use strict';

var Provider = require('../');
var provider = new Provider();

var files = provider.create('files', {});
files.set('foo', 'bar', function(err, results) {
  if (err) return console.error(err);
  files.get('foo', function(err, results) {
    if (err) return console.error(err);
    console.log(results);
  });
});
