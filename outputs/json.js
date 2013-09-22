var utils = require('../utils');
var withContentType = utils.withContentType;
var transform = utils.transform;

module.exports = function () {
  var first = true;
  return withContentType(transform(transformRecord, transformEnd), 'application/json');
  function transformRecord(record, encoding, callback) {
    if (first) {
      first = false;
      this.push('[');
    } else {
      this.push(',');
    }
    this.push(JSON.stringify(record));
    callback();
  }

  function transformEnd(finish) {
    this.push(']');
    callback();
  }
};