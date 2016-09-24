var _ = require('lodash'),
    as = require('../index');

module.exports = function (name, what/*, ...*/) {
  var then = arguments.length > 1 ? as.apply(null, _.slice(arguments, 1)) : null;
  return this.and(as.check(as.indirect(then ? function bindNamed(m) {
    return function (v) {
      this[name] = then;
      return as[m].call(this, v); // Do not apply definition when defining
    }
  } : function applyNamed(m) {
    return function (v) {
      return this[name][m].call(this, v);
    }
  })));
}
