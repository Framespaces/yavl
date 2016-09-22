var _ = require('lodash'),
    assert = require('chai').assert
    as = require('../index');

describe('yavl definitions', function () {
  it('should apply a trivial definition', function () {
    assert.isTrue(as.def('number', Number).def('number').matches(1));
    assert.isFalse(as.def('number', Number).def('number').matches('1'));
  });
  it('should apply a deep definition', function () {
    assert.isTrue(as.def('address', {
      name : String,
      code : /[A-Z]{2}[0-9]+[A-Z]?\s*[0-9]+[A-Z]{2}/
    }).and({
      firstName : String,
      lastName : String,
      address : as.def('address')
    }).matches({
      firstName : 'Fred',
      lastName : 'Bloggs',
      address : {
        name : '1',
        code : 'SW1A 2AA'
      }
    }));
  });
});
