var as = require('../index');

module.exports = function (what/*, ...*/) {
  var left = this, right = as.apply(this, arguments);
  return as.check({
    matches : function (value, status) {
      return left.matches(value, status) || right.matches(value, status);
    },
    coerce : function (value, status) {
      return left.matches(value, status) ? left.coerce(value, status) : right.coerce(value, status);
    },
    validate : function (value, status) {
      return left.matches(value, status) ? left.validate(value, status) : right.validate(value, status);
    }
  });
};
