var csv = require('csv');
var utils = require('../utils');
var withContentType = utils.withContentType;
var transform = utils.transform;
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
  function transformPost(record, encoding, callback) {
    if (firstPost) {
      firstPost = false;
      this.push('sep=,\r\n');
    }
    this.push(record);
    callback();
  }
  function transformPre(record, encoding, callback) {
    if (record.fields) {
      if (firstPre) firstPre = false;
      else this.push([]);
      record = record.fields;
    }
    this.push(record);
    callback();
  }
};