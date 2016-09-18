var _ = require('lodash'),
    assert = require('chai').assert
    as = require('../index');

describe('yavl examples', function () {
  it('should validate Fred', function () {
    var schema = as({
      name : String,
      age : Number
    });

    assert.isTrue(schema.matches({
      name : 'Fred',
      age : 40
    }));

    assert.deepEqual(schema.coerce({
      name : 'Fred',
      age : '40'
    }), { name : 'Fred', age : 40 });

    assert.throws(_.partial(schema.validate, {
      name : 'Fred',
      age : '40'
    }), TypeError);
  });
});
