var _ = require('lodash'),
    as = require('../index');

module.exports = function (name, matches, cast, error) {
  return as.check({
    matches : matches,
    cast : cast,
    validate : function (value) {
      if (!matches(value)) throw new TypeError(error + ': ' + value);
      return value;
    }
  }, name);
};
