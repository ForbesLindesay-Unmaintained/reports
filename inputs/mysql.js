var Readable = require('barrage').Readable;

module.exports = function (connection, str, args) {
  var query, fields;
  var paused = true;
  var stream = new Readable({objectMode: true});

  stream._read = function () {
    if (!query) {
      query = connection.query(str, args);
      query.on('error', function (err) { stream.emit('error', err); });
      query.on('end', function () { stream.push(null); });
      query.on('fields', function (fs) {
        fields = fs.map(function (f) { return f.name; });
        var fieldNames = fields.map(function (f) {
          return f.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ');
        });
        if (!stream.push({fields: fieldNames}) && !paused) {
          connection.pause();
          paused = true;
        }
      });
      query.on('result', function (record) {
        if (record.constructor.name === 'RowDataPacket') {
          record = fields.map(function (f) { return record[f]; });
          if (!stream.push(record) && !paused) {
            connection.pause();
          }
        } else {
          stream.emit('packet', record);
        }
      });
    } else if (paused) {
      connection.resume();
    }
  };

  return stream;
};