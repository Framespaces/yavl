var _ = require('lodash'),
    assert = require('chai').assert
    as = require('../index');

describe('yavl statics', function () {
  describe('nothing', function () {
    it('should match anything', function () {
      assert.isTrue(as.matches(1));
      assert.isTrue(as.matches('1'));
    });
    it('should coerce everything to itself', function () {
      assert.equal(as.coerce('1'), '1');
      assert.equal(as.coerce(1), 1);
      var o = {};
      assert.equal(as.coerce(o), o);
    });
    it('should validate anything', function () {
      assert.equal(as.validate(1), 1);
      assert.equal(as.validate('1'), '1');
    });
  });
  describe('error', function () {
    it('should not match anything', function () {
      assert.isFalse(as(Error).matches(1));
      assert.isFalse(as(Error).matches('1'));
    });
    it('should coerce everything to undefined', function () {
      assert.equal(as(Error).coerce('1'), undefined);
      assert.equal(as(Error).coerce(1), undefined);
      assert.equal(as(Error).coerce({}), undefined);
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
    it('should coerce a number to itself', function () {
      assert.equal(as(Number).coerce(1), 1);
    });
    it('should validate a number', function () {
      assert.equal(as(Number).validate(1), 1);
    });
    it('should not match a string', function () {
      assert.isFalse(as(Number).matches('1'));
    });
    it('should coerce a valid string', function () {
      assert.strictEqual(as(Number).coerce('1'), 1);
    });
    it('should not validate a string', function () {
      assert.throws(_.partial(as(Number).validate, '1'), TypeError);
    });
  });
  describe('object', function () {
    it('should match an object', function () {
      assert.isTrue(as(Object).matches({}));
    });
    it('should coerce an object to itself', function () {
      var o = {};
      assert.equal(as(Object).coerce(o), o);
    });
    it('should validate an object', function () {
      var o = {};
      assert.equal(as(Object).validate(o), o);
    });
    it('should not match a string', function () {
      assert.isFalse(as(Object).matches('1'));
    });
    it('should coerce a string, bizarrely', function () {
      assert.deepEqual(as(Object).coerce('1'), { 0 : '1' });
    });
    it('should not validate a string', function () {
      assert.throws(_.partial(as(Object).validate, '1'), TypeError);
    });
  });
  describe('array', function () {
    it('should match an array', function () {
      assert.isTrue(as(Array).matches([]));
    });
    it('should coerce an array to itself', function () {
      var a = [];
      assert.equal(as(Array).coerce(a), a);
    });
    it('should validate an array', function () {
      var a = [];
      assert.equal(as(Array).validate(a), a);
    });
    it('should not match a string', function () {
      assert.isFalse(as(Array).matches('1'));
    });
    it('should coerce a string', function () {
      assert.deepEqual(as(Array).coerce('1'), ['1']);
    });
    it('should not validate a string', function () {
      assert.throws(_.partial(as(Array).validate, '1'), TypeError);
    });
  });
  describe('string', function () {
    it('should match a string', function () {
      assert.isTrue(as(String).matches('1'));
    });
    it('should coerce a string to itself', function () {
      assert.equal(as(String).coerce('1'), '1');
    });
    it('should validate a string', function () {
      assert.equal(as(String).validate('1'), '1');
    });
    it('should not match a number', function () {
      assert.isFalse(as(String).matches(1));
    });
    it('should coerce a number', function () {
      assert.deepEqual(as(String).coerce(1), '1');
    });
    it('should not validate a number', function () {
      assert.throws(_.partial(as(String).validate, 1), TypeError);
    });
  });
  describe('JSON', function () {
    it('should match JSON', function () {
      assert.isTrue(as(JSON).matches('"1"'));
    });
    it('should coerce JSON to itself', function () {
      assert.equal(as(JSON).coerce('"1"'), '"1"');
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
    it('should coerce a number', function () {
      assert.deepEqual(as(JSON).coerce(1), '1');
    });
    it('should coerce an object', function () {
      assert.deepEqual(as(JSON).coerce({ a : 1 }), '{"a":1}');
    });
    it('should not validate a number', function () {
      assert.throws(_.partial(as(JSON).validate, 1), TypeError);
    });
  });
});
