var _ = require('lodash'),
    assert = require('chai').assert
    as = require('../index');

describe('yavl status reporting', function () {
  it('should report statics', function () {
    var status = new as.Status();
    as(Number).matches('1', status);
    assert.deepEqual(status.failures, ['number']);
  });
  it('should report unary operators', function () {
    var status = new as.Status();
    as.size(1).matches([], status);
    assert.deepEqual(status.failures, ['size']);
  });
  it('should report binary operators', function () {
    var status = new as.Status();
    as.gt(1).matches(1, status);
    assert.deepEqual(status.failures, ['gt']);
  });
  it('should report array indexes', function () {
    var status = new as.Status();
    as([Number]).matches(['1'], status);
    assert.deepEqual(status.failures, ['array.0.number']);
  });
  it('should report object keys', function () {
    var status = new as.Status();
    as({ a : Number }).matches({ a : '1' }, status);
    assert.deepEqual(status.failures, ['object.a.number']);
  });
  it('should report deep object keys', function () {
    var status = new as.Status();
    as({ a : { b : Number } }).matches({ a : { b : '1' } }, status);
    assert.deepEqual(status.failures, ['object.a.object.b.number']);
  });
});
