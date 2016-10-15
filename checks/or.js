var _ = require('lodash'),
    as = require('../index');

module.exports = function (what/*, ...*/) {
  var left = this, right = as.apply(this, arguments);
  function bestMatch(value, status) {
    return _.maxBy([left, right], function (check) {
      var tempStatus = new as.Status(status.defs);
      check.matches(value, tempStatus);
      return tempStatus.quality;
    });
  }
  return as.check(as.indirect(function byBestMatch(methodName) {
    return function(value, status) {
      return bestMatch(value, status)[methodName](value, status);
    }
  }), null, 0); // Logical operator has no weight
};
