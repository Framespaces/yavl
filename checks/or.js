var _ = require('lodash'),
    as = require('../index');

module.exports = function (what/*, ...*/) {
  var left = this, right = as.apply(this, arguments);
  return as.check({
    matches : function (value, status) {
      return left.matches(value, status) || right.matches(value, status);
    },
    cast : function (value, status) {
      // We want to cast to the best quality match
      return _.maxBy([left, right], function (check) {
        var before = status.quality;
        check.matches(value, status);
        return status.quality - before;
      }).cast(value, status);
    },
    validate : function (value, status) {
      return left.matches(value, status) ? value : right.validate(value, status);
    }
  });
};
