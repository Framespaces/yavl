var _ = require('lodash'),
    assert = require('chai').assert
    as = require('../index');

describe('yavl objects', function () {
  describe('matching', function () {
    it('should match an empty object to any object longhand', function () {
      assert.isTrue(as.object.with({}).matches({}));
      assert.isTrue(as.object.with({}).matches({ a : 1 }));
    });
    it('should match an empty object to any object shorthand', function () {
      assert.isTrue(as({}).matches({}));
      assert.isTrue(as({}).matches({ a : 1 }));
    });
    // From now on, just using shorthand (as for typical clients)
    it('should match a typed object of any size', function () {
      assert.isFalse(as({ a : Number }).matches({}));
      assert.isTrue(as({ a : Number }).matches({ a : 1 }));
      assert.isTrue(as({ a : Number }).matches({ a : 1, b : 2 }));
      assert.isFalse(as({ a : String, b : Number }).matches({}));
      assert.isFalse(as({ a : String, b : Number }).matches({ a : '1' }));
      assert.isTrue(as({ a : String, b : Number }).matches({ a : '1', b : 2 }));
      assert.isTrue(as({ a : String, b : Number }).matches({ a : '1', b : 2, c : 3 }));
      assert.isTrue(as({ a : String, b : Number }).matches({ a : '1', b : 2, c : '3' }));
    });
    it('should not match a wrongly-typed object of size > 0', function () {
      assert.isFalse(as({ a : Number }).matches({ a : '1' }));
      assert.isFalse(as({ a : Number }).matches({ a : '1', b : '2' }));
    });
    it('should not match a heterogeneous wrongly typed object', function () {
      assert.isFalse(as({ a : String, b : Number }).matches({ a : 1 }));
      assert.isFalse(as({ a : String, b : Number }).matches({ a : 1, b : 2 }));
    });
    it('should enforce a forced-empty object', function () {
      assert.isTrue(as({ undefined : Error }).matches({}));
      assert.isFalse(as({ undefined : Error }).matches({ a : 1 }));
      assert.isFalse(as({ undefined : Error }).matches({ a : 1, b : 2 }));
    });
    it('should enforce wildcard keys', function () {
      assert.isTrue(as({ a : Number, undefined : Error }).matches({ a : 1 }));
      assert.isFalse(as({ a : Number, undefined : Error }).matches({ a : 1, b : 2 }));
      assert.isTrue(as({ a : Number, undefined : String }).matches({ a : 1, b : '2' }));
      assert.isFalse(as({ a : Number, undefined : Number }).matches({ a : 1, b : '2' }));
    });
  });
  describe('coercing', function () {
    it('should coerce any object to itself longhand', function () {
      assert.deepEqual(as.object.with({}).coerce({}), {});
      assert.deepEqual(as.object.with({}).coerce({ a : 1 }), { a : 1 });
    });
    it('should coerce any object to itself with an empty object shorthand', function () {
      assert.deepEqual(as({}).coerce({}), {});
      assert.deepEqual(as({}).coerce({ a : 1 }), { a : 1 });
    });
    // From now on, just using shorthand (as for typical clients)
    it('should coerce a heterogeneous typed object', function () {
      assert.deepEqual(as({ a : String, b : Number }).coerce({ a : 1, b : 2 }), { a : '1', b : 2 });
      assert.deepEqual(as({ a : String, b : Number }).coerce({ a : 1, b : 2, c : '3' }), { a : '1', b : 2, c : '3' });
    });
    it('should coerce a forced-empty object to empty', function () {
      assert.deepEqual(as({ a : Error }).coerce({ a : 1 }), {});
      assert.deepEqual(as({ undefined : Error }).coerce({ a : 1, b : 2 }), {});
    });
    it('should truncate to a fixed-keys object', function () {
      assert.deepEqual(as({ a : Number, b : Error }).coerce({ a : 1 }), { a : 1 });
      assert.deepEqual(as({ a : Number, b : Error }).coerce({ a : 1, b : 2 }), { a : 1 });
    });
  });
  describe('validating', function () {
    it('should validate any object with an empty object', function () {
      assert.deepEqual(as({}).validate({}), {});
      assert.deepEqual(as({}).validate({ a : 1 }), { a : 1 });
    });
    it('should validate a fixed-keys object', function () {
      assert.deepEqual(as({ a : Number, b : Error }).validate({ a : 1 }), { a : 1 });
      assert.throws(_.partial(as({ a : Number, b : Error }).validate, { a : 1, b : 2 }));
    });
  });
  describe('aggregating', function () {
    it('should match a size exactly', function () {
      assert.isTrue(as.size(0).matches({}));
      assert.isTrue(as.size(1).matches({ a : 1 }));
      assert.isFalse(as.size(1).matches({}));
    });
    it('should coerce a size to a number if no-args', function () {
      assert.equal(as.size().coerce({ a : 2 }), 1);
    });
    it('should undefine an object if branched', function () {
      assert.equal(as.size(as.eq(1)).coerce({ a : 1, b : 2 }), undefined);
    });
    it('should undefine an object if implicitly branched', function () {
      assert.equal(as.size(1).coerce({ a : 1, b : 2 }), undefined);
    });
    it('should match a size less than, by no-args', function () {
      assert.isTrue(as.size().lt(1).matches({}));
      assert.isFalse(as.size().lt(1).matches({ a : 1 }));
    });
    it('should match a size less than, by branch', function () {
      assert.isTrue(as.size(as.lt(1)).matches({}));
      assert.isFalse(as.size(as.lt(1)).matches({ a : 1 }));
    });
  });
});
