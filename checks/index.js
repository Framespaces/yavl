var _ = require('lodash');

module.exports = {
  define : require('./define'),
  defined : require('./define').d,
  or : require('./or'),
  and : require('./and'),
  with : require('./with'),
  regexp : require('./regexp')
};
_.each(['size', 'first', 'last', 'ceil', 'floor', 'max', 'mean', 'min', 'sum'], function (unary) {
  module.exports[unary] = require('./unary')(unary);
});
_.each(['eq', 'lt', 'lte', 'gt', 'gte'], function (op) {
  module.exports[op] = require('./binary')(op);
});
