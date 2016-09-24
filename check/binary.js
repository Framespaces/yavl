var _ = require('lodash'),
    as = require('../index');

module.exports = function (op) {
  return function (expected) {
    var left = this;
    return as.check({
      matches : function (value, status) {
        return _[op](left.coerce(value, status), expected);
      },
      coerce : function (value, status) {
        value = left.coerce(value, status);
        return _[op](value, expected) ? value : expected; // TODO: Incorrect for gte and lte
      },
      validate : function (value, status) {
        value = left.validate(value, status);
        if (!_[op](value, expected)) throw new TypeError('Not' + op + ': ' + value + ', ' + expected);
        return value;
      }
    }, op);
  };
};
