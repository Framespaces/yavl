var _ = require('lodash'),
    as = require('../index');

module.exports = function (op, ary) {
  return function (what/*, ...*/) {
    var left = this,
        args = _.slice(arguments, 0, ary),
        right = as.apply(null, _.slice(arguments, ary)),
        branched = arguments.length > ary;

    function cast(value, result) {
      switch (op) {
      case 'size':
        if (_.isArray(value)) return _.set(value, 'length', result);
        if (_.isString(value)) return value.slice(0, result);
        return undefined;
      case 'first': return _.set(value, 0, result);
      case 'last': return _.set(value, value.length - 1, result);
      case 'nth': return _.set(value, args[0], result);
      default: return undefined; // TODO: could be improved
      }
    }
    function applyOp(value) {
      return _[op].apply(_, [value].concat(args));
    }
    return as.check({
      matches : function (value, status) {
        return right.matches(applyOp(left.cast(value, status)));
      },
      cast : function (value, status) {
        var leftCasted = left.cast(value, status), result = applyOp(leftCasted);
        return branched ? cast(leftCasted, right.cast(result)) : result;
      },
      validate : function (value, status) {
        var valid = left.validate(value, status), casted = applyOp(valid);
        right.validate(casted, status);
        return branched ? valid : casted;
      }
    }, op);
  };
};
