var _ = require('lodash'),
    as = require('../index');

module.exports = function (op) {
  return function (what/*, ...*/) {
    var left = this, right = as.apply(null, arguments), branched = arguments.length;
    return as.check({
      matches : function (value, status) {
        return right.matches(_[op](left.cast(value, status)));
      },
      cast : function (value, status) {
        var casted = _[op](left.cast(value, status));
        if (branched) {
          casted = right.cast(casted);
          switch (op) {
          case 'size':
            if (_.isArray(value)) return _.set(value, 'length', casted);
            if (_.isString(value)) return value.slice(0, casted);
            return undefined;
          case 'first': return _.set(value, 0, casted);
          case 'last': return _.set(value, value.length - 1, casted);
          default: return undefined; // TODO: could be improved
          }
        } else {
          return casted;
        }
      },
      validate : function (value, status) {
        var valid = left.validate(value, status), casted = _[op](valid);
        right.validate(casted, status);
        return branched ? valid : casted;
      }
    }, op);
  };
};
