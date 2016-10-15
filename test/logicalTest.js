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
    it('should validate against either argument', function () {
      assert.equal(as(Number).or(2).validate(1), 1);
      assert.equal(as(String).or(1).validate(1), 1);
    });
    it('should cast to a type in preference to undefined', function () {
      assert.equal(as(Number).or(undefined).cast('1'), 1);
      assert.equal(as(undefined).or(Number).cast('1'), 1);
    });
    it('should cast to the best matching object of two', function () {
      var good = { a : 1, b : 2, c : 3 }, okay = { a : 1, b : 3, c : 5 };
      assert.deepEqual(as(good).or(okay).cast({ a : 1, b : 2 }), good);
      assert.deepEqual(as(okay).or(good).cast({ a : 1, b : 2 }), good);
      assert.deepEqual(as(good).or(okay).cast({ a : 1, c : 3 }), good);
      assert.deepEqual(as(okay).or(good).cast({ a : 1, c : 3 }), good);
      assert.deepEqual(as(good).or(okay).cast({ b : 2, c : 3 }), good);
      assert.deepEqual(as(okay).or(good).cast({ b : 2, c : 3 }), good);
    });
    it('should cast to the best matching object of three', function () {
      var good = { a : 1, b : 2, c : 3 }, okay = { a : 1, b : 3, c : 5 }, bad = { d : 10 };
      assert.deepEqual(as(good).or(okay).or(bad).cast({ a : 1, b : 2 }), good);
      assert.deepEqual(as(bad).or(okay).or(good).cast({ a : 1, b : 2 }), good);
      assert.deepEqual(as(okay).or(bad).or(good).cast({ a : 1, b : 2 }), good);
    });
    it('should cast to a matching defined object of two', function () {
      var good = { a : 1, b : 2, c : 3 }, okay = { a : 1, b : 3, c : 5 };
      assert.deepEqual(as(good).or(undefined).cast({ a : 1, b : 2 }), good);
      assert.deepEqual(as(undefined).or(good).cast({ a : 1, b : 2 }), good);
    });
    it('should cast to a matching defined object of three', function () {
      var good = { a : 1, b : 2, c : 3 }, okay = { a : 1, b : 3, c : 5 };
      assert.deepEqual(as(good).or(okay).or(undefined).cast({ a : 1, b : 2 }), good);
      assert.deepEqual(as(undefined).or(okay).or(good).cast({ a : 1, b : 2 }), good);
      assert.deepEqual(as(okay).or(undefined).or(good).cast({ a : 1, b : 2 }), good);
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
