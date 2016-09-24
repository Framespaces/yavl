var as = require('../index');

module.exports = function (what/*, ...*/) {
  var left = this, right = as.apply(null, arguments);
  return as.check({
    matches : function (value, status) {
      return left.matches(value, status) &&
        right.matches(left.coerce(value, status), status, left.name);
    },
    coerce : function (value, status) {
      return right.coerce(left.coerce(value, status), status, left.name);
    },
    validate : function (value, status) {
      return right.validate(left.validate(value, status), status, left.name);
    }
  });
};
