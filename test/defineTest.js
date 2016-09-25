var _ = require('lodash'),
    assert = require('chai').assert
    as = require('../index');

describe('yavl definitions', function () {
  it('should apply a trivial definition', function () {
    assert.isTrue(as.define('number', Number).defined('number').matches(1));
    assert.isFalse(as.define('number', Number).defined('number').matches('1'));
  });
  it('should apply a deep definition', function () {
    assert.isTrue(as.define('address', {
      name : String,
      code : /[A-Z]{2}[0-9]+[A-Z]?\s*[0-9]+[A-Z]{2}/
    }).and({
      firstName : String,
      lastName : String,
      address : as.defined('address')
    }).matches({
      firstName : 'Fred',
      lastName : 'Bloggs',
      address : {
        name : '1',
        code : 'SW1A 2AA'
      }
    }));
  });
  it('should recursively apply a definition', function () {
    assert.isTrue(as.defined('group', {
      members : [as(Number).or(as.defined('group'))]
    }).matches({
      members : [1, 2, { members : [3, 4] }]
    }));
  });
});
