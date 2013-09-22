var escape = require('escape-html');
var utils = require('../utils');
var withContentType = utils.withContentType;
var transform = utils.transform;

module.exports = function () {
  var first = true;'text/html'
  return withContentType(transform(transformRecord, transformEnd), 'text/html');
  function transformRecord(record, encoding, callback) {
    if (first) {
      first = false;
    } else if (record.fields) {
      this.push('</tbody></table>');
    }
    if (record.fields) {
      this.push('<table>');
      this.push('<thead>');
      this.push('<tr>');
      for (var i = 0; i < record.fields.length; i++) {
        this.push('<th>');
        this.push(escape(record.fields[i]));
        this.push('</th>');
      }
      this.push('</tr>');
      this.push('</thead>');
      this.push('<tbody>');
    } else {
      this.push('<tr>');
      for (var i = 0; i < record.length; i++) {
        this.push('<td>');
        this.push(escape(record[i] === null ? '' : record[i]));
        this.push('</td>');
      }
      this.push('</tr>');
    }
    callback();
  }

  function transformEnd(callback) {
    this.push('</tbody></table>');
    callback();
  }
};