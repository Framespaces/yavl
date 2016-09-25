var _ = require('lodash'),
    assert = require('chai').assert
    as = require('../index');

describe('yavl examples', function () {
  it('should check Fred', function () {
    var schema = {
      name : String,
      age : Number
    };

    assert.isTrue(as(schema).matches({
      name : 'Fred',
      age : 40
    }));

    assert.deepEqual(as(schema).cast({
      name : 'Fred',
      age : '40'
    }), { name : 'Fred', age : 40 });

    assert.throws(_.partial(as(schema).validate, {
      name : 'Fred',
      age : '40'
    }), TypeError);
  });

  it('should check drawing action', function () {
    assert.isTrue(as({
      id : /^[a-f0-9]{32}$/,
      type : as('addition', 'removal', 'update'),
      shape : as.def('shape', {
        name : as('polygon', 'polyline', 'line', 'rect', 'ellipse', 'circle', 'path'),
        attr : as({ undefined : as(String, Number) }).size(as.lte(10)),
        text : as(String).size(as.lte(1000)),
        children : as([as.def('shape')]).or(undefined),
        bbox : { x : Number, y : Number, width : Number, height : Number, undefined : Error },
        undefined : Error
      }).def('shape')
    }).matches({
      id : 'df13fbb92b9d43a7b53339abfb912cb4',
      type : 'update',
      shape : {
        name : 'circle',
        attr : { cx : 10, cy : 10, r : 10 },
        bbox : { x : 0, y : 0, width : 20, height : 10 }
      }
    }));
  });
});
