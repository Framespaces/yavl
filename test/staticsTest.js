var _ = require('lodash'),
    assert = require('chai').assert
    as = require('../index');

describe('yavl statics', function () {
  describe('nothing', function () {
    it('should match anything', function () {
      assert.isTrue(as.matches(1));
      assert.isTrue(as.matches('1'));
      assert.isTrue(as.matches({}));
      assert.isTrue(as.matches(undefined));
    });
    it('should cast everything to itself', function () {
      assert.equal(as.cast('1'), '1');
      assert.equal(as.cast(1), 1);
      var o = {};
      assert.equal(as.cast(o), o);
    });
    it('should validate anything', function () {
      assert.equal(as.validate(1), 1);
      assert.equal(as.validate('1'), '1');
    });
  });
  describe('error', function () {
    it('should not match anything', function () {
      assert.isTrue(as(Error).matches());
      assert.isTrue(as(Error).matches(undefined));
      assert.isFalse(as(Error).matches(1));
      assert.isFalse(as(Error).matches('1'));
    });
    it('should cast everything to undefined', function () {
      assert.equal(as(Error).cast('1'), undefined);
      assert.equal(as(Error).cast(1), undefined);
      assert.equal(as(Error).cast({}), undefined);
    });
    it('should validate undefined', function () {
      assert.equal(as(Error).validate(undefined), undefined);
    });
    it('should not validate anything', function () {
      assert.throws(_.partial(as(Error).validate, '1'), TypeError);
      assert.throws(_.partial(as(Error).validate, 1), TypeError);
    });
  });
  describe('number', function () {
    it('should match a number', function () {
      assert.isTrue(as(Number).matches(1));
    });
    it('should cast a number to itself', function () {
      assert.equal(as(Number).cast(1), 1);
    });
    it('should validate a number', function () {
      assert.equal(as(Number).validate(1), 1);
    });
    it('should not match a string', function () {
      assert.isFalse(as(Number).matches('1'));
    });
    it('should cast a valid string', function () {
      assert.strictEqual(as(Number).cast('1'), 1);
    });
    it('should not validate a string', function () {
      assert.throws(_.partial(as(Number).validate, '1'), TypeError);
    });
  });
  describe('object', function () {
    it('should match an object', function () {
      assert.isTrue(as(Object).matches({}));
    });
    it('should cast an object to itself', function () {
      var o = {};
      assert.equal(as(Object).cast(o), o);
    });
    it('should validate an object', function () {
      var o = {};
      assert.equal(as(Object).validate(o), o);
    });
    it('should not match a string', function () {
      assert.isFalse(as(Object).matches('1'));
    });
    it('should cast a string, bizarrely', function () {
      assert.deepEqual(as(Object).cast('1'), { 0 : '1' });
    });
    it('should not validate a string', function () {
      assert.throws(_.partial(as(Object).validate, '1'), TypeError);
    });
  });
  describe('array', function () {
    it('should match an array', function () {
      assert.isTrue(as(Array).matches([]));
    });
    it('should cast an array to itself', function () {
      var a = [];
      assert.equal(as(Array).cast(a), a);
    });
    it('should validate an array', function () {
      var a = [];
      assert.equal(as(Array).validate(a), a);
    });
    it('should not match a string', function () {
      assert.isFalse(as(Array).matches('1'));
    });
    it('should cast a string', function () {
      assert.deepEqual(as(Array).cast('1'), ['1']);
    });
    it('should not validate a string', function () {
      assert.throws(_.partial(as(Array).validate, '1'), TypeError);
    });
  });
  describe('string', function () {
    it('should match a string', function () {
      assert.isTrue(as(String).matches('1'));
    });
    it('should cast a string to itself', function () {
      assert.equal(as(String).cast('1'), '1');
    });
    it('should validate a string', function () {
      assert.equal(as(String).validate('1'), '1');
    });
    it('should not match a number', function () {
      assert.isFalse(as(String).matches(1));
    });
    it('should cast a number', function () {
      assert.equal(as(String).cast(1), '1');
    });
    it('should cast null and undefined to empty', function () {
      assert.equal(as(String).cast(undefined), '');
      assert.equal(as(String).cast(null), '');
    });
    it('should not validate a number', function () {
      assert.throws(_.partial(as(String).validate, 1), TypeError);
    });
  });
  describe('Date', function () {
    it('should match a Date', function () {
      assert.isTrue(as(Date).matches(new Date));
    });
  });
  describe('JSON', function () {
    it('should match JSON', function () {
      assert.isTrue(as(JSON).matches('"1"'));
    });
    it('should cast JSON to itself', function () {
      assert.equal(as(JSON).cast('"1"'), '"1"');
    });
    it('should validate a string in JSON', function () {
      assert.equal(as(JSON).validate('"1"'), '"1"');
    });
    it('should validate an object in JSON', function () {
      assert.equal(as(JSON).validate('{"a":1}'), '{"a":1}');
    });
    it('should not match a number', function () {
      assert.isFalse(as(JSON).matches(1));
    });
    it('should cast a number', function () {
      assert.deepEqual(as(JSON).cast(1), '1');
    });
    it('should cast an object', function () {
      assert.deepEqual(as(JSON).cast({ a : 1 }), '{"a":1}');
    });
    it('should not validate a number', function () {
      assert.throws(_.partial(as(JSON).validate, 1), TypeError);
    });
  });
});
