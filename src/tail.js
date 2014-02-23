var fs = require('fs');
var path = require('path');
var stream = require('stream');
var util = require('util');
var common = require('./common');

function TailStream(options) {
  stream.Transform.call(this, options);

  options = options || {};

  this.length = options.length || 10;
  this.lines = new Array(this.length);
  this.lastIndex = 0;
}
util.inherits(TailStream, stream.Transform);

TailStream.prototype._transform = _transform;
function _transform(chunk, encoding, callback) {
  console.log('TYPE:', typeof chunk);
  if (typeof chunk === 'string') {
    transformString();
  } else {
    transformBuffer();
  }

  callback();
  return;

  function transformString() {
    // TODO(schoon) - Optimize.
    var lines = chunk.slice('\n').slice(-10);
    var line;

    while (!!(line = lines.shift())) {
      this.lines.shift();
      this.lines.push(line);
    }
  }

  function transformBuffer() {
    var i = 0;
    var len = chunk.length;

    for (; i < len; i++) {
      var newline = chunk[i] === 10;

      if (newline) {
      }
    }
  }
}

TailStream.prototype._flush = _flush;
function _flush(callback) {
  for (var i = 0, len = this.lines.length; i < len; i++) {
    this.push(this.lines[i]);
  }

  callback();
}

//@
//@ ### tail(options, filename)
//@ ### tail(filename)
//@ Available options:
//@
//@ + `f`: The -f option causes tail to not stop when end of file is reached,
//@        but rather to wait for additional data to be appended to the input.
//@
//@ Examples:
//@
//@ ```javascript
//@ tail('file');
//@ tail('-f', 'log');
//@ ```
//@
//@ Reads the "tail" of a file: its last 10 lines. If -f is specified, the
//@ stream is held open, printing all output appended to the file. Returns a
//@ ReadableStream.
function _tail(options, filename) {
  options = common.parseOptions(options, {
    'f': 'live'
  });

  if (!filename) {
    common.error('Missing <filename>');
  }

  filename = path.resolve(process.cwd(), String(filename));

  if (!fs.existsSync(filename)) {
    common.error('Input file does not exist', true);
  }

  return fs.createReadStream(filename)
    .pipe(new TailStream());
}
module.exports = _tail;





// fs.watch('somedir', function (event, filename) {
//   console.log('event is: ' + event);
//   if (filename) {
//     console.log('filename provided: ' + filename);
//   } else {
//     console.log('filename not provided');
//   }
// });
