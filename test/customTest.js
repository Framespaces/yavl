var _ = require('lodash'),
    assert = require('chai').assert
    as = require('../index');

describe('custom checker', function () {
  var check = as.check({
    matches : function (value) {
      return value === 'silly';
    }
  });
  it('should match something silly', function () {
    assert.isTrue(check.matches('silly'));
    assert.isFalse(check.matches('sensible'));
  });
  it('should match something deeply silly', function () {
    assert.isTrue(as({ deeply : check }).matches({ deeply : 'silly' }));
    assert.isFalse(as({ deeply : check }).matches({ deeply : 'sensible' }));
  });
  it('should extend yavl', function () {
    as = as.extend({ silly : check });
    assert.isTrue(as.silly.matches('silly'));
    assert.isTrue(as.string.silly.matches('silly'));
    assert.isTrue(as(/silly/).silly.matches('silly'));
  });
});
