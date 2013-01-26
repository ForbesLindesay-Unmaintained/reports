var transform = require('transform-stream');
var escape = require('escape-html');
var utils = require('../utils');
var withContentType = utils.withContentType;

module.exports = function () {
  var first = true;'text/html'
  return withContentType(transform(transformRecord, transformEnd), 'text/html');
  function transformRecord(record, next, finish) {
    if (first) {
      first = false;
    } else if (record.fields) {
      next('</tbody></table>');
    }
    if (record.fields) {
      next('<table>');
      next('<thead>');
      next('<tr>');
      for (var i = 0; i < record.fields.length; i++) {
        next('<th>');
        next(escape(record.fields[i]));
        next('</th>');
      }
      next('</tr>');
      next('</thead>');
      finish(null, '<tbody>');
    } else {
      next('<tr>');
      for (var i = 0; i < record.length; i++) {
        next('<td>');
        next(escape(record[i] === null ? '' : record[i]));
        next('</td>');
      }
      finish(null, '</tr>');
    }
  }

  function transformEnd(finish) {
    finish(null, '</tbody></table>')
  }
};