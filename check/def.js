var _ = require('lodash'),
    as = require('../index');

module.exports = function (name, what/*, ...*/) {
  var then = arguments.length > 1 ? as.apply(null, _.slice(arguments, 1)) : null;
  return this.and(as.check(as.indirect(then ? function bindNamed(m) {
    return function (value, status) {
      status.defs[name] = then;
      return as[m](value, status); // Do not apply definition when defining
    }
  } : function applyNamed(m) {
    return function (value, status) {
      return status.defs[name][m](value, status);
    }
  })));
}
