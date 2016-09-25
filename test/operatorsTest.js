var _ = require('lodash'),
    assert = require('chai').assert
    as = require('../index');

describe('yavl operators', function () {
  describe('equality', function () {
    it('should match equal things longhand', function () {
      assert.isTrue(as.eq(1).matches(1));
    });
    it('should match equal things shorthand', function () {
      assert.isTrue(as(1).matches(1));
    });
    it('should cast equal things longhand', function () {
      assert.equal(as.eq(1).cast(1), 1);
    });
    it('should cast equal things shorthand', function () {
      assert.equal(as(1).cast(1), 1);
    });
    it('should validate equal things longhand', function () {
      assert.equal(as.eq(1).validate(1), 1);
    });
    it('should validate equal things shorthand', function () {
      assert.equal(as(1).validate(1), 1);
    });
    it('should not match unequal things longhand', function () {
      assert.isFalse(as.eq(1).matches(2));
    });
    it('should cast unequal things longhand', function () {
      assert.equal(as.eq(1).cast(2), 1);
    });
    it('should not validate unequal things longhand', function () {
      assert.throws(_.partial(as.eq(1).validate, 2), TypeError);
    });
  })
  describe('ranges', function () {
    it('should match in-range things', function () {
      assert.isTrue(as.lte(1).matches(1));
      assert.isTrue(as.gt(0).lt(10).matches(1));
    });
    it('should cast in-range things', function () {
      assert.equal(as.lte(1).cast(1), 1);
    });
    it('should validate in-range things', function () {
      assert.equal(as.lte(1).validate(1), 1);
    });
    it('should not match not in-range things', function () {
      assert.isFalse(as.lte(1).matches(2));
    });
    it('should cast not in-range things', function () {
      assert.equal(as.lte(1).cast(2), 1);
    });
    it('should not validate not in-range things', function () {
      assert.throws(_.partial(as.lte(1).validate, 2), TypeError);
    });
  })
  describe('regexp', function () {
    it('should match matching things longhand', function () {
      assert.isTrue(as.regexp(/a/).matches('a'));
    });
    it('should match matching things shorthand', function () {
      assert.isTrue(as(/a/).matches('a'));
    });
    it('should cast matching things longhand', function () {
      assert.equal(as.regexp(/a/).cast('a'), 'a');
    });
    it('should cast matching things shorthand', function () {
      assert.equal(as(/a/).cast('a'), 'a');
    });
    it('should validate matching things longhand', function () {
      assert.equal(as.regexp(/a/).validate('a'), 'a');
    });
    it('should validate matching things shorthand', function () {
      assert.equal(as(/a/).validate('a'), 'a');
    });
    it('should not match not matching things longhand', function () {
      assert.isFalse(as.regexp(/a/).matches('b'));
    });
    it('should not match not matching things shorthand', function () {
      assert.isFalse(as(/a/).matches('b'));
    });
    it('should cast not matching things to undefined', function () {
      assert.equal(as.regexp(/a/).cast('b'), undefined);
    });
    it('should not validate not matching things', function () {
      assert.throws(_.partial(as.regexp(/a/).validate, 'b'), TypeError);
    });
  })
});
