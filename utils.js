var Stream = require('stream');
exports.chain = chain;
function chain(write, read) {
  var stream = new Stream();
  stream.writable = true;
  stream.readable = true;
  var oldOn = stream.on.bind(stream);
  stream.on = function (name, fn) {
    oldOn(name, fn);
    switch (name) {
      case 'data':
      case 'end':
        return read.on(name, fn);
      case 'drain':
      case 'pipe':
        return write.on(name, fn);
      case 'close':
        var i = 2;
        write.on('close', function () {
          if (0 === --i) {
            fn();
          }
        });
        read.on('close', function () {
          if (0 === --i) {
            fn();
          }
        });
        return;
      case 'error':
        write.on(name, fn);
        read.on(name, fn);
        return;
    }
  };

  stream.write = write.write.bind(write);
  stream.end = write.end.bind(write);

  stream.setEncoding = read.setEncoding.bind(read);
  stream.pause = read.pause.bind(read);
  stream.resume = read.resume.bind(read);
  stream.pipe = read.pipe.bind(read);

  stream.destroy = function () {
    read.destroy.apply(read, arguments);
    write.destroy.apply(write, arguments);
  };
  stream.destroySoon = function () {
    write.destroySoon.apply(write, arguments);
    read.destroy.apply(read, arguments);
  };

  return stream;
}

exports.withContentType = withContentType;
function withContentType(stream, contentType) {
  var pipe = stream.pipe;
  stream.pipe = function (dest) {
    if (dest.headers) {
      dest.headers['content-type'] = contentType;
    } else if (dest.setHeader) {
      dest.setHeader('content-type', contentType);
    }
    pipe.apply(this, arguments);
  };
  return stream;
}