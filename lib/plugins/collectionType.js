
module.exports = function(proto) {

  /**
   * Set collection types for a collection.
   *
   * @param {String} `plural` e.g. `products`
   * @param {Object} `options`
   */

  proto.collectionType = proto.collectionType || function(plural, types) {
    var len = types.length, i = 0;
    while (len--) {
      var type = types[i++];
      this.collectionTypes[type] = this.collectionTypes[type] || [];
      if (this.collectionTypes[type].indexOf(plural) === -1) {
        this.collectionTypes[type].push(plural);
      }
    }
    return types;
  };

};
