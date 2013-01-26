var fromArray = require('read-stream').fromArray;
var src = fromArray([{fields: ['Head, "A" & Head, "B"']},['foo & bar'], {fields: ['Head, "A"', 'Head, "B"', 'Head, "C"']}, ['foo', 'bar', 'baz']]);
var trans = src.pipe(require('./outputs/html')())
var dest = trans.pipe(process.stdout);