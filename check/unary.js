var _ = require('lodash'),
    as = require('../index');

module.exports = function (op) {
  return function (what/*, ...*/) {
    var left = this, right = as.apply(null, arguments), branched = arguments.length;
    return as.check({
      matches : function (value, status) {
        return right.matches(_[op](left.coerce(value, status)));
      },
      coerce : function (value, status) {
        var coerced = _[op](left.coerce(value, status));
        if (branched) {
          coerced = right.coerce(coerced);
          switch (op) {
          case 'size':
            if (_.isArray(value)) return _.set(value, 'length', coerced);
            if (_.isString(value)) return value.slice(0, coerced);
            return undefined;
          case 'first': return _.set(value, 0, coerced);
          case 'last': return _.set(value, value.length - 1, coerced);
          default: return undefined; // TODO: could be improved
          }
        } else {
          return coerced;
        }
      },
      validate : function (value, status) {
        var valid = left.validate(value, status), coerced = _[op](valid);
        right.validate(coerced, status);
        return branched ? valid : coerced;
      }
    }, op);
  };
};
