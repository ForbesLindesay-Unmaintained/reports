var Stream = require('stream');

module.exports = (connection, str, args) {
  var query = connection.query(str);
  var stream = new Stream();

  var fields;
  query.on('error', function (err) { stream.emit('error', err); });
  query.on('end', function () { stream.emit('end'); });
  query.on('fields', function (fs) {
    fields = fs.map(function (f) { return f.name; });
    stream.emit('data', {
      fields: fields.map(function (f) {
        return f.replace(/([a-z])([A-Z])/g, function (_, a, b) { return a + ' ' + b.toLowerCase(); }).replace(/_/g, ' ');
      })
    });
  });
  query.on('result', function (record) {
    if (record.constructor.name === 'RowDataPacket')
      stream.emit('data', fields.map(function (f) { return record[f]; }));
    else
      stream.emit('packet', record);
  });

  query.on('end', function () {
    stream.emit('end');
  });

  stream.pause = connection.pause.bind(query);
  stream.resume = connection.resume.bind(query);

  return stream;
};