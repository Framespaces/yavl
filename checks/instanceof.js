var as = require('../index');

module.exports = function (constructor) {
  return as.check({
    matches : function (value, status) {
      return value instanceof constructor;
    },
    cast : function (value, status) {
      return value instanceof constructor ? value : new constructor(value);
    },
    validate : function (value, status) {
      if (!(value instanceof constructor)) {
        throw new TypeError('Not an instance of ' + constructor.name + ': ' + value);
      }
      return value;
    }
  });
};
