var _ = require('lodash'),
    as = require('../index');

/**
 * Defines a schema
 */
var define = module.exports = function (name, what/*, ...*/) {
  var defined = as.apply(null, _.slice(arguments, 1));
  return this.and(as.check(as.indirect(function bindNamed(m) {
    return function (value, status) {
      status.defs[name] = defined;
      return as[m](value, status); // Do not apply definition when defining
    }
  })));
};

/**
 * Applies a defined schema (may also create it, in the same breath)
 */
define.d = function (name/*, what...*/) {
  var apply = as.check(as.indirect(function applyNamed(m) {
    return function (value, status) {
      return status.defs[name][m](value, status);
    }
  }));
  if (arguments.length > 1) {
    return this.and(define.apply(this, arguments)).and(apply);
  } else {
    return this.and(apply);
  }
};
