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
    it('should cast to one argument then the other', function () {
      assert.equal(as(Number).and(2).cast('1'), 2);
    });
    it('should validate against both arguments', function () {
      assert.equal(as(Number).and(1).validate(1), 1);
    });
  });
  describe('or (longhand)', function () {
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
    it('should cast to the left argument if it matches', function () {
      assert.equal(as(Number).or(2).cast(1), 1);
    });
    it('should cast to the right argument if the left does not match', function () {
      assert.equal(as(String).or(2).cast(1), 2);
    });
    it('should validate against either argument', function () {
      assert.equal(as(Number).or(2).validate(1), 1);
      assert.equal(as(String).or(1).validate(1), 1);
    });
  });
  describe('or (shorthand)', function () {
    it('should match if both arguments do', function () {
      assert.isTrue(as(Number, 1).matches(1));
    });
    it('should match either argument', function () {
      assert.isTrue(as(Number, 2).matches(1));
      assert.isTrue(as(String, 1).matches(1));
    });
    it('should match any argument', function () {
      assert.isTrue(as(Number, Boolean, '1').matches(1));
      assert.isTrue(as(Number, Boolean, '1').matches(true));
      assert.isTrue(as(Number, Boolean, '1').matches('1'));
      assert.isTrue(as('1', '2', '3').matches('1'));
      assert.isTrue(as('1', '2', '3').matches('2'));
      assert.isTrue(as('1', '2', '3').matches('3'));
      assert.isFalse(as('1', '2', '3').matches('4'));
    });
    it('should not match if neither argument does', function () {
      assert.isFalse(as(String, 2).matches(1));
    });
  });
});
