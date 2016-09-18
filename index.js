var _ = require('lodash');

function as(what/*, ...*/) {
  if (arguments.length > 0) {
    if (arguments.length === 1) {
      return as1(what);
    } else {
      return as1(arguments[0]).or([].slice.call(arguments, 1));
    }
  } else {
    return as;
  }
}

function wrapped(wrap) {
  return {
    matches : wrap('matches'),
    coerce : wrap('coerce'),
    validate : wrap('validate')
  };
}

as.matches = _.constant(true);
as.coerce = _.identity;
as.validate = _.identity;

as.check = function (check) {
  // Entirely excusable sleight of hand to allow custom checkers
  check.__isChecker = true;

  function bindSchema(m) {
    var f = check[m];
    return function (v) {
      return f.call(this.__isChecker ? {} : this, v);
    }
  }

  _.assign(check, wrapped(bindSchema), {
    def : function (name, what/*, ...*/) {
      var then = arguments.length > 1 ? as.apply(null, [].slice.call(arguments, 1)) : null;
      function bindNamed(m) {
        return function (v) {
          return (this[name] || (this[name] = then))[m].call(this, v);
        }
      }
      return check.and(as.check(wrapped(bindNamed)));
    },
    or : function (what/*, ...*/) {
      var then = as.apply(null, arguments);
      return as.check({
        matches : function (v) {
          return check.matches.call(this, v) || then.matches.call(this, v);
        },
        coerce : function (v) {
          return check.matches.call(this, v) ? check.coerce.call(this, v) : then.coerce.call(this, v);
        },
        validate : function (v) {
          return check.matches.call(this, v) ? check.validate.call(this, v) : then.validate.call(this, v);
        }
      });
    },
    and : function (what/*, ...*/) {
      var then = as.apply(null, arguments);
      return as.check({
        matches : function (v) {
          return check.matches.call(this, v) && then.matches.call(this, check.coerce.call(this, v));
        },
        coerce : function (v) {
          return then.coerce.call(this, check.coerce.call(this, v));
        },
        validate : function (v) {
          return then.validate.call(this, check.validate.call(this, v));
        }
      });
    },
    with : function (whats) {
      if (_.isEmpty(whats)) {
        return _.isArray(whats) ? as.array : as.object; // No validation
      } else {
        var ass = _.isArray(whats) ? _.map(whats, as1) : _.mapValues(whats, as1);
        function what(k) {
          return _.has(ass, k) ? ass[k] : _.isArray(whats) ? _.last(ass) : (ass['undefined'] || as);
        }
        function keys(v) {
          return _.isArray(v) ? _.keys(v) : _.uniq(_.keys(v).concat(_.without(_.keys(ass), 'undefined')));
        }
        return check.and(as.check({
          matches : function (v) {
            return _.every(keys(v), _.bind(function (k) {
              return what(k).matches.call(this, v[k]);
            }, this));
          },
          coerce : function (v) {
            return _.reduce(keys(v), _.bind(function (v, k) {
              var coerced = what(k).coerce.call(this, v[k]);
              return _.isUndefined(coerced) ? _.unset(v, k) && v : _.set(v, k, coerced);
            }, this), v);
          },
          validate : function (v) {
            return _.reduce(keys(v), _.bind(function (v, k) {
              var valid = what(k).validate.call(this, v[k]);
              return _.isUndefined(valid) ? _.unset(v, k) && v : _.set(v, k, valid);
            }, this), v);
          }
        }));
      }
    },
    regexp : function (regexp) {
      return check.and(as.check({
        matches : _.bind(regexp.test, regexp),
        coerce : _.bind(regexp.exec, regexp),
        validate : function (v) {
          var matches = regexp.exec(v);
          if (!matches) throw new TypeError('Does not match: ' + v + ', ' + regexp);
          return matches;
        }
      }));
    }
  });
  _.each(['size', 'first', 'last', 'ceil', 'floor', 'max', 'mean', 'min', 'sum'], function (unary) {
    if (!check[unary]) {
      check[unary] = function (what/*, ...*/) {
        var then = as.apply(null, arguments), branched = arguments.length;
        return as.check({
          matches : function (v) {
            return then.matches.call(this, _[unary](check.coerce.call(this, v)));
          },
          coerce : function (v) {
            var coerced = _[unary](check.coerce.call(this, v));
            if (branched) {
              coerced = then.coerce.call(this, coerced);
              switch (unary) {
              case 'size':
                if (_.isArray(v)) return _.set(v, 'length', coerced);
                if (_.isString(v)) return v.slice(0, coerced);
                return undefined;
              case 'first': return _.set(v, 0, coerced);
              case 'last': return _.set(v, v.length - 1, coerced);
              default: return undefined; // TODO: could be improved
              }
            } else {
              return coerced;
            }
          },
          validate : function (v) {
            var valid = check.validate.call(this, v), coerced = _[unary](valid);
            then.validate.call(this, coerced);
            return branched ? valid : coerced;
          }
        });
      };
    }
  });
  _.each(['eq', 'lt', 'lte', 'gt', 'gte'], function (op) {
    if (!check[op]) {
      check[op] = function (expected) {
        return as.check({
          matches : function (v) {
            return _[op](check.coerce.call(this, v), expected);
          },
          coerce : function (v) {
            v = check.coerce.call(this, v);
            return _[op](v, expected) ? v : expected; // TODO: Incorrect for gte and lte
          },
          validate : function (v) {
            v = check.validate.call(this, v);
            if (!_[op](v, expected)) throw new TypeError('Not' + op + ': ' + v + ', ' + expected);
            return v;
          }
        });
      };
    }
  });
  return check;
}

as.error = as.check({
  // The Error constructor indicates a forced mismatch
  matches : _.constant(false), // Nothing matches an TypeError
  coerce : _.constant(undefined), // Errors coerce to nothing
  validate : function (v) { if (!_.isUndefined(v)) throw new TypeError('Not allowed: ' + v); return v; }
});
as.object = as.check({
  matches : _.isObject,
  coerce : Object,
  validate : function (v) { if (!_.isObject(v)) throw new TypeError('Not an object: ' + v); return v; }
});
as.array = as.check({
  matches : _.isArray,
  // The global Array function is not idempotent
  coerce : _.castArray,
  validate : function (v) { if (!_.isArray(v)) throw new TypeError('Not an array: ' + v); return v; }
});
as.boolean = as.check({
  matches : _.isBoolean,
  coerce : Boolean,
  validate : function (v) { if (!_.isBoolean(v)) throw new TypeError('Not a boolean: ' + v); return v; }
});
as.string = as.check({
  matches : _.isString,
  coerce : String,
  validate : function (v) { if (!_.isString(v)) throw new TypeError('Not a string: ' + v); return v; }
});
as.number = as.check({
  matches : _.isNumber,
  coerce : Number,
  validate : function (v) { if (!_.isNumber(v)) throw new TypeError('Not a number: ' + v); return v; }
});
as.date = as.check({
  matches : _.isDate,
  // The Date constructor is not idempotent for coerce
  coerce : function (v) { return _.isDate(v) ? v : new Date(v) },
  validate : function (v) { if (!_.isDate(v)) throw new TypeError('Not a date: ' + v); return v; }
});

function as1(what) {
  switch (what) {
  case Error: return as.error;
  case Array: return as.array;
  case Object: return as.object;
  case Boolean: return as.boolean;
  case String: return as.string;
  case Number: return as.number;
  case Date: return as.date;
  default:
    if (_.isArray(what)) {
      return as.array.with(what);
    } else if (_.isRegExp(what)) {
      return as.regexp(what);
    } else if (_.isObject(what)) {
      return what.__isChecker ? what : as.object.with(what);
    } else {
      return as.eq(what);
    }
  }
}

module.exports = as.check(as);
