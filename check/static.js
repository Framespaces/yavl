var _ = require('lodash'),
    as = require('../index');

module.exports = function (name, matches, coerce, error) {
  return as.check({
    matches : matches,
    coerce : coerce,
    validate : function (value) {
      if (!matches(value)) throw new TypeError(error + ': ' + value);
      return value;
    }
  }, name);
};
