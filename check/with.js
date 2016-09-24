var _ = require('lodash'),
    as = require('../index');

module.exports = function (whats) {
  if (_.isEmpty(whats)) {
    return _.isArray(whats) ? as.array : as.object; // No validation
  } else {
    var ass = _.isArray(whats) ? _.map(whats, _.ary(as, 1)) : _.mapValues(whats, _.ary(as, 1));
    function what(k) {
      return _.has(ass, k) ? ass[k] : _.isArray(whats) ? _.last(ass) : (ass['undefined'] || as);
    }
    function keys(value) {
      return _.isArray(value) ? _.keys(value) : _.uniq(_.keys(value).concat(_.without(_.keys(ass), 'undefined')));
    }
    return this.and(as.check({
      matches : function (value, status) {
        return _.every(keys(value), _.bind(function (k) {
          return what(k).matches(value[k], status, k);
        }, this));
      },
      coerce : function (value, status) {
        return _.reduce(keys(value), _.bind(function (value, k) {
          var coerced = what(k).coerce(value[k], status, k);
          return _.isUndefined(coerced) ? _.unset(value, k) && value : _.set(value, k, coerced);
        }, this), value);
      },
      validate : function (value, status) {
        return _.reduce(keys(value), _.bind(function (value, k) {
          var valid = what(k).validate(value[k], status, k);
          return _.isUndefined(valid) ? _.unset(value, k) && value : _.set(value, k, valid);
        }, this), value);
      }
    }));
  }
};
