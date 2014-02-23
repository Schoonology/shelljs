var shell = require('..');

var assert = require('assert'),
    fs = require('fs'),
    path = require('path');

shell.config.silent = true;

shell.rm('-rf', 'tmp');
shell.mkdir('tmp');

// Prepare tmp/
shell.cp('resources/*', 'tmp');

//
// Invalids
//

shell.tail();
assert.ok(shell.error());

shell.tail('-f');
assert.ok(shell.error());

shell.tail('tmp/noexist');
assert.ok(shell.error());

//
// Valids
//

function buffer(stream, callback) {
  var buf = '';
  stream.on('data', function (chunk) {
    buf += String(chunk);
  });
  stream.on('end', function () {
    callback(null, buf);
  });
}

var result = shell.tail('resources/a.txt');
assert.equal(shell.error(), null);
buffer(result, function (err, result) {
  console.log('B');
  assert.equal(result.split('\n').length, 10);
  assert.equal(result.split('\n').shift(), 'This is line two');
  assert.equal(result.split('\n').pop(), 'This is line eleven');

  shell.exit(123);
});

console.log('A');
  shell.exit(123);
