var transform = require('transform-stream');
var utils = require('../utils');
var withContentType = utils.withContentType;

module.exports = function () {
  var first = true;
  return withContentType(transform(transformRecord, transformEnd), 'application/json');
  function transformRecord(record, next, finish) {
    console.log(record);
    if (first) {
      first = false;
      next('[');
    } else {
      next(',');
    }
    finish(null, JSON.stringify(record));
  }

  function transformEnd(finish) {
    console.log('end');
    finish(null, ']')
  }
};