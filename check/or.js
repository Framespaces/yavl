var as = require('../index');

module.exports = function (what/*, ...*/) {
  var left = this, right = as.apply(this, arguments);
  return as.check({
    matches : function (value, status) {
      return left.matches(value, status) || right.matches(value, status);
    },
    cast : function (value, status) {
      return left.matches(value, status) ? left.cast(value, status) : right.cast(value, status);
    },
    validate : function (value, status) {
      return left.matches(value, status) ? value : right.validate(value, status);
    }
  });
};
