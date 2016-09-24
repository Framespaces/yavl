var _ = require('lodash'),
    assert = require('chai').assert
    as = require('../index');

describe('yavl logic operators', function () {
  describe('and', function () {
    it('should match both arguments', function () {
      assert.isTrue(as(Number).and(1).matches(1));
    });
    it('should not match a non-matching left argument', function () {
      assert.isFalse(as(String).and(1).matches(1));
    });
    it('should not match a non-matching right argument', function () {
      assert.isFalse(as(Number).and(2).matches(1));
    });
    it('should coerce to one argument then the other', function () {
      assert.equal(as(Number).and(2).coerce('1'), 2);
    });
    it('should validate against both arguments', function () {
      assert.equal(as(Number).and(1).validate(1), 1);
    });
  });
  describe('or', function () {
    it('should match if both arguments do', function () {
      assert.isTrue(as(Number).or(1).matches(1));
    });
    it('should match either argument', function () {
      assert.isTrue(as(Number).or(2).matches(1));
      assert.isTrue(as(String).or(1).matches(1));
    });
    it('should not match if neither argument does', function () {
      assert.isFalse(as(String).or(2).matches(1));
    });
    it('should coerce to the left argument if it matches', function () {
      assert.equal(as(Number).or(2).coerce(1), 1);
    });
    it('should coerce to the right argument if the left does not match', function () {
      assert.equal(as(String).or(2).coerce(1), 2);
    });
    it('should validate against either argument', function () {
      assert.equal(as(Number).or(2).validate(1), 1);
      assert.equal(as(String).or(1).validate(1), 1);
    });
  });
});
