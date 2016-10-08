var _ = require('lodash'),
    define = require('./define'),
    transform = require('./transform'),
    binary = require('./binary');

module.exports = {
  define : define,
  defined : define.d,
  or : require('./or'),
  and : require('./and'),
  with : require('./with'),
  regexp : require('./regexp'),
  size : transform('size', 0),
  first : transform('first', 0),
  last : transform('last', 0),
  nth : transform('nth', 1),
  ceil : transform('ceil', 0),
  floor : transform('floor', 0),
  max : transform('max', 0),
  mean : transform('mean', 0),
  min : transform('min', 0),
  sum : transform('sum', 0),
  eq : binary('eq'),
  lt : binary('lt'),
  lte : binary('lte'),
  gt : binary('gt'),
  gte : binary('gte')
};
