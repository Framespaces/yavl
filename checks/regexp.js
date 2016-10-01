var as = require('../index');

module.exports = function (regexp) {
  var left = this;
  return as.check({
    matches : function (value, status) {
      return regexp.test(left.cast(value, status));
    },
    cast : function (value, status) {
      return regexp.exec(left.cast(value, status));
    },
    validate : function (value, status) {
      var matches = regexp.exec(left.validate(value, status));
      if (!matches) throw new TypeError('Does not match: ' + value + ', ' + regexp);
      return matches;
    }
  }, 'regexp');
};
