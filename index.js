var _ = require('lodash');

var as = module.exports = function as(what/*, ...*/) {
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

function as1(what) {
  switch (what) {
  case Error: return as.error;
  case Array: return as.array;
  case Object: return as.object;
  case Boolean: return as.boolean;
  case String: return as.string;
  case Number: return as.number;
  case Date: return as.date;
  case JSON: return as.json;
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

as.indirect = function (method) {
  return {
    matches : method('matches'),
    coerce : method('coerce'),
    validate : method('validate')
  };
}

as.matches = _.constant(true);
as.coerce = _.identity;
as.validate = _.identity;

as.checks = {
  def : require('./check/def'),
  or : require('./check/or'),
  and : require('./check/and'),
  with : require('./check/with'),
  regexp : require('./check/regexp')
};
_.each(['size', 'first', 'last', 'ceil', 'floor', 'max', 'mean', 'min', 'sum'], function (unary) {
  as.checks[unary] = require('./check/unary')(unary);
});
_.each(['eq', 'lt', 'lte', 'gt', 'gte'], function (op) {
  as.checks[op] = require('./check/binary')(op);
});

function makeStatus(status) {
  status || (status = {});
  status.path || (status.path = []);
  status.defs || (status.defs = {});
  status.failures || (status.failures = []);
  status.push || (status.push = function (name, keys) {
    keys = _.compact(keys.concat(name));
    status.path.push.apply(status.path, keys);
    return keys.length;
  });
  status.pop || (status.pop = function (count) {
    _.times(count, _.bind(status.path.pop, status.path));
  });
  status.failed || (status.failed = function () {
    var path = status.path.join('.');
    if (!_.some(status.failures, _.method('startsWith', path))) {
      status.failures.push(path);
    }
    return path || 'any';
  });
  return status;
}

as.check = function (check, name) {
  // Entirely excusable sleight of hand to allow custom checkers
  check.__isChecker = true;
  check.name = name;

  return _.assign(check, as.indirect(function bindStatus(m) {
    var f = check[m];
    return function (value, status, key/*, ...*/) {
      status = makeStatus(status);
      var count = status.push(name, _.slice(arguments, 2));
      try {
        var result = f(value, status);
        return (m !== 'matches' || result) ? result : !status.failed();
      } catch (err) {
        throw err.message ?
          _.set(err, 'message', err.message + ' at ' + status.failed()) : err;
      } finally {
        status.pop(count);
      }
    }
  }), as.checks);
}

as.error = require('./check/static')('error', _.isUndefined, _.constant(undefined), 'Not allowed');
as.object = require('./check/static')('object', _.isObject, Object, 'Not an object');
as.array = require('./check/static')('array', _.isArray, _.castArray, 'Not an array');
as.boolean = require('./check/static')('boolean', _.isBoolean, Boolean, 'Not a boolean');
as.string = require('./check/static')('string', _.isString, String, 'Not a string');
as.number = require('./check/static')('number', _.isNumber, Number, 'Not a number');
as.date = require('./check/static')('date', _.isDate, function (value) {
  // The Date constructor is not idempotent
  return _.isDate(value) ? value : new Date(value);
}, 'Not a date');

function isJson(value) {
  try {
    return _.isString(value) && JSON.parse(value) && true;
  } catch (err) {
    return false;
  }
}
as.json = require('./check/static')('json', isJson, function (value) {
  // JSON.stringify is not idempotent
  return isJson(value) ? value : JSON.stringify(value);
}, 'Not JSON');

as.check(as);
