var transform = require('transform-stream');
var csv = require('csv');
var utils = require('../utils');
var withContentType = utils.withContentType;
var chain = utils.chain;
module.exports = function () {
  var firstPre = true;
  var firstPost = true;
  var pre = transform(transformPre);
  var cs = csv();
  var post = transform(transformPost);
  cs.on('error', function (e) { post.emit('error', e); });
  pre.pipe(cs).pipe(post);
  return withContentType(chain(pre, post), 'text/csv');
  function transformPost(record, next, finish) {
    if (firstPost) {
      firstPost = false;
      next('sep=,\r\n');
    }
    finish(null, record);
  }
  function transformPre(record, next, finish) {
    if (firstPre) {
      firstPre = false;
      if (record.fields) {
        record = record.fields;
      }
    } else if (record.fields) {
      next([]);
      record = record.fields;
    }
    finish(null, record);
  }
};