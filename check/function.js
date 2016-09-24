var _ = require('lodash'),
    as = require('../index');

module.exports = function (what/*, ...*/) {
  var params = _.map(arguments, _.ary(as, 1)), returns = as;
  function decorate(value, method) {
    var f = _.isFunction(value) ? value : _.constant(value);
    return function () {
      return returns[method](f.apply(this, _.map(arguments, function (arg, i) {
        return (params[i] || as)[method](arg);
      })));
    }
  }
  return as.check({
    matches : _.isFunction,
    coerce : function (value) {
      return decorate(value, 'coerce');
    },
    validate : function (value) {
      if (!_.isFunction(value)) throw new TypeError('Not a function: ' + value);
      return decorate(value, 'validate');
    },
    returns : function (what/*, ...*/) {
      returns = as.apply(this, arguments);
      return this;
    }
  }, 'function');
};
