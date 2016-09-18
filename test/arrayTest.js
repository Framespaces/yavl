var _ = require('lodash'),
    assert = require('chai').assert
    as = require('../index');

describe('yavl arrays', function () {
  describe('matching', function () {
    it('should match an empty array to any array longhand', function () {
      assert.isTrue(as.array.with([]).matches([]));
      assert.isTrue(as.array.with([]).matches([1]));
    });
    it('should match an empty array to any array shorthand', function () {
      assert.isTrue(as([]).matches([]));
      assert.isTrue(as([]).matches([1]));
    });
    // From now on, just using shorthand (as for typical clients)
    it('should match a typed array of any length', function () {
      assert.isTrue(as([Number]).matches([]));
      assert.isTrue(as([Number]).matches([1]));
      assert.isTrue(as([Number]).matches([1, 2]));
    });
    it('should not match a wrongly-typed array of length > 0', function () {
      assert.isFalse(as([Number]).matches(['1']));
      assert.isFalse(as([Number]).matches(['1', '2']));
    });
    it('should match a heterogeneous typed array of any length', function () {
      assert.isTrue(as([String, Number]).matches([]));
      assert.isTrue(as([String, Number]).matches(['1']));
      assert.isTrue(as([String, Number]).matches(['1', 2]));
      assert.isTrue(as([String, Number]).matches(['1', 2, 3]));
    });
    it('should not match a heterogeneous wrongly typed array', function () {
      assert.isFalse(as([String, Number]).matches([1]));
      assert.isFalse(as([String, Number]).matches([1, 2]));
      assert.isFalse(as([String, Number]).matches(['1', 2, '3']));
    });
    it('should not match a forced-empty array of length > 0', function () {
      assert.isFalse(as([Error]).matches([1]));
      assert.isFalse(as([Error]).matches([1, 2]));
    });
    it('should not match a fixed-length array of length > max', function () {
      assert.isTrue(as([Number, Error]).matches([1]));
      assert.isFalse(as([Number, Error]).matches([1, 2]));
    });
  });
  describe('coercing', function () {
    it('should coerce any array to itself longhand', function () {
      assert.deepEqual(as.array.with([]).coerce([]), []);
      assert.deepEqual(as.array.with([]).coerce([1]), [1]);
    });
    it('should coerce any array to itself with an empty array shorthand', function () {
      assert.deepEqual(as([]).coerce([]), []);
      assert.deepEqual(as([]).coerce([1]), [1]);
    });
    // From now on, just using shorthand (as for typical clients)
    it('should coerce a heterogeneous typed array of any length', function () {
      assert.deepEqual(as([String, Number]).coerce([]), []);
      assert.deepEqual(as([String, Number]).coerce([1]), ['1']);
      assert.deepEqual(as([String, Number]).coerce([1, 2]), ['1', 2]);
      assert.deepEqual(as([String, Number]).coerce([1, 2, '3']), ['1', 2, 3]);
    });
    it('should coerce a forced-empty array to empty', function () {
      assert.deepEqual(as([Error]).coerce([1]), []);
      assert.deepEqual(as([Error]).coerce([1, 2]), []);
    });
    it('should truncate to a fixed-length array', function () {
      assert.deepEqual(as([Number, Error]).coerce([1]), [1]);
      assert.deepEqual(as([Number, Error]).coerce([1, 2]), [1]);
    });
  });
  describe('validating', function () {
    it('should validate any array with an empty array', function () {
      assert.deepEqual(as([]).validate([]), []);
      assert.deepEqual(as([]).validate([1]), [1]);
    });
    it('should validate a fixed-length array', function () {
      assert.deepEqual(as([Number, Error]).validate([1]), [1]);
      assert.throws(_.partial(as([Number, Error]).validate, [1, 2]));
    });
  });
  describe('aggregating', function () {
    it('should match a size exactly', function () {
      assert.isTrue(as.size(0).matches([]));
      assert.isTrue(as.size(1).matches([1]));
      assert.isFalse(as.size(1).matches([]));
    });
    it('should coerce a size to a number if no-args', function () {
      assert.equal(as.size().coerce([2]), 1);
    });
    it('should coerce a size onto an array if branched', function () {
      assert.deepEqual(as.size(as.eq(1)).coerce([1, 2]), [1]);
    });
    it('should coerce a size onto an array if implicitly branched', function () {
      assert.deepEqual(as.size(1).coerce([1, 2]), [1]);
    });
    it('should match a size less than, by no-args', function () {
      assert.isTrue(as.size().lt(1).matches([]));
      assert.isFalse(as.size().lt(1).matches([1]));
    });
    it('should match a size less than, by branch', function () {
      assert.isTrue(as.size(as.lt(1)).matches([]));
      assert.isFalse(as.size(as.lt(1)).matches([1]));
    });
    it('should coerce to the first of an array', function () {
      assert.equal(as.first().coerce([1, 2]), 1);
    });
    it('should validate the first of an array', function () {
      assert.deepEqual(as.first(1).validate([1, 2]), [1, 2]);
      assert.deepEqual(as.first().eq(1).validate([1, 2]), 1);
    });
  });
});
