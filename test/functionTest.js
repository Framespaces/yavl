var _ = require('lodash'),
    assert = require('chai').assert
    as = require('../index');

describe('yavl functions', function () {
  it('should match a function', function () {
    assert.isTrue(as(Function).matches(_.noop));
  });
  it('should not match a number', function () {
    assert.isFalse(as(Function).matches(1));
  });
  it('should cast to a function', function () {
    assert.isTrue(_.isFunction(as(Function).cast(1)));
  });
  it('should validate a function', function () {
    assert.isTrue(_.isFunction(as(Function).validate(_.noop)));
  });
  it('should cast function return', function () {
    assert.equal(as(Function).returns(Number).cast(_.constant('1'))(), 1);
  });
  it('should cast function parameters', function () {
    assert.equal(as.function(Number).cast(_.identity)('1'), 1);
  });
  it('should not cast excess function parameters', function () {
    assert.equal(as.function(Number).cast(function (n, v) { return v; })(1, '2'), '2');
  });
  it('should validate function parameters', function () {
    assert.equal(as.function(Number).validate(_.identity)(1), 1);
    assert.throws(_.partial(as.function(Number).validate(_.identity), '1'));
  });
  it('should validate multiple function parameters', function () {
    assert.throws(_.partial(as.function(Number, String).validate(_.identity), 1, 2));
  });
});
