# **yavl**_!_

[![Build Status](https://travis-ci.org/Framespaces/yavl.svg?branch=master)](https://travis-ci.org/Framespaces/yavl)
[![Code Climate](https://codeclimate.com/github/Framespaces/yavl/badges/gpa.svg)](https://codeclimate.com/github/Framespaces/yavl)

Yet Another Validation Language (for JavaScript)

... but this one is _beautiful_.

```javascript
var as = require('yavl');

var schema = {
  name : String,
  age : Number
};

as(schema).matches({
  name : 'Fred',
  age : 40
}); // => true

as(schema).cast({
  name : 'Fred',
  age : '40'
}); // => { name : 'Fred', age : 40 }

as(schema).validate({
  name : 'Fred',
  age : '40'
}); // => throws TypeError
```

## ✓ let's get crazy
```javascript
as({
  id : /^[a-f0-9]{32}$/,
  type : as('addition', 'removal', 'update'),
  shape : as.def('shape', {
    name : as('polygon', 'polyline', 'line', 'rect', 'ellipse', 'circle', 'path'),
    attr : as({ undefined : as(String, Number) }).size(as.lte(100)),
    text : as(String).size(as.lte(1000)),
    children : as([as.def('shape')]).or(undefined),
    bbox : { x : Number, y : Number, width : Number, height : Number, undefined : Error },
    undefined : Error
  }).def('shape')
}).matches({
  id : 'df13fbb92b9d43a7b53339abfb912cb4',
  type : 'update',
  shape : {
    name : 'circle',
    attr : { cx : 10, cy : 10, r : 10 },
    bbox : { x : 0, y : 0, width : 20, height : 10 }
  }
}); // => true
```

## ✓ so, basically
The function returned from `require('yavl')` (we'll label it `as` from now on) transforms a _schema_ into a _checker_ for that schema. A checker has the three methods we've seen above:
* `matches(value)` returns `true` if the value matches the schema
* `cast(value)` does its best to cast the value to something matching the schema
* `validate(value)` throws a `TypeError` if the value doesn't match the schema

Schemas can be hashes (as above), arrays, or a selection of JavaScript global objects representing basic types. Once a schema is established, it can be refined with chained, nested or branched operators and filters. Sounds complicated? It isn't. Let's dive in.

## ✓ types
```javascript
as(Number).matches(1);
as(String).matches('1');
as(Boolean).matches('1');
as(Date).matches(new Date);
as(Object).matches({});
as(Array).matches([]);
as(Function).matches(function () {});
as(JSON).matches('"1"');
```
The `Error` object is used to force a mis-match. Only `undefined` matches `Error`.
```javascript
as(Error).matches(undefined);
```
The `as` function itself matches anything. This is useful for constructs like '... or anything' (see below).
```javascript
as.matches(1) && as.matches('1') && as.matches({}) && as.matches(undefined)
```

## ✓ literals and logic
```javascript
as('woah').matches('woah');
as(String).and('woah').matches('woah');
as('woah').or('dude').matches('woah');
as('woah', 'dude').matches('woah'); // shorthand for the above
```

## ✓ objects
Objects are strict about their declared keys.
```javascript
as({ a : Number }).matches({}) === false;
```
To allow a key to be undefined, use logic.
```javascript
as({ a : as(Number).or(undefined) }).matches({});
as({ a : as(Number, undefined) }).matches({}); // Shorthand or
```
On the other hand, an object schema is easy about additional keys ('be liberal in what you accept from others').
```javascript
as({}).matches({ a : 1 });
```
A key of 'undefined' means 'anything else'.
```javascript
as({ undefined : Number }).matches({ a : 1 });
as({ undefined : Number }).matches({ b : 1 });
```
So you can prevent additional keys using `Error`.
```javascript
as({ undefined : Error }).matches({ a : 1 }) === false;
```

## ✓ arrays
An empty array is a shortcut for (any) `Array`.
```javascript
as([]).matches([]);
as([]).matches([1, 2]);
```
But arrays are strict about their declared indexes.
```javascript
as([Number]).matches([]) === false;
```
To allow an index to be undefined, use logic.
```javascript
as([as(Number).or(undefined)]).matches([]);
as([as(Number, undefined)]).matches([]); // Shorthand or
```
On the other hand, an array schema is easy about additional indexes. However, they need to match
the last declared index.
```javascript
as([Number]).matches([1, 2]);
as([Number]).matches([1, '2']) === false;
as([Number, String]).matches([1, '2', '3']);
as([Number, String]).matches([1, '2', 3]) === false;
```
To get around this, use the `as` function to match anything.
```javascript
as([Number, String, as]).matches([1, '2', 3, new Date]);
```
You can prevent additional keys entirely using `Error`.
```javascript
as([Number, Error]).matches([1, 2]) === false;
```

## ✓ operators
We've met equality already, with literals. These are actually a shorthand:
```javascript
as('woah').matches('woah');
as.eq('woah').matches('woah'); // shorthand for the above
```
yavl's operators are inherited from [lodash](https://lodash.com/docs/#eq). So, we have
`eq`, `lt`, `lte`, `gt`, and `gte`.
```javascript
as.gt(0).lt(10).matches(1);
```
We also have regexes, which also has a shorthand:
```javascript
as.regexp(/a/).matches('a');
as(/a/).matches('a');
```

## ✓ aggregations
Objects and arrays can be aggregated with `size`, `first`, `last`, `ceil`, `floor`, `max`, `mean`, `min` and `sum`.
```javascript
as.size(1).matches([1]);
as.first(1).matches([1, 2]);
```
The arguments in an aggregation function are actually a schema. So:
```javascript
as.size(1, 2).matches(['a']); // Is shorthand for...
as.size(as.eq(1).or(2)).matches(['a']);
as.size(1, 2).matches(['a', 'b']);
as.size(1, 2).matches(['a', 'b', 'c']) === false;
```

## ✓ functions
You can check function parameters and return values using `as.function()` followed optionally by `returns`.
However, since the checking only happens when you actually call the function, we need to use
`cast` or `validate`. Casting will also cast the parameters if possible:
```javascript
function addOne(n) { return n + 1; }
as.function(Number).returns(Number).cast(addOne)('1') === 2;
as.function(Number).returns(Number).validate(addOne)('1'); // throws TypeError (on the argument)
as.function(Number).returns(String).validate(addOne)(1); // throws TypeError (on the return value)
```

## ✓ getting feedback
An error thrown by validation will have a message which indicates where the failure happened. If you want to get feedback
from a match, provide a second argument of object type `as.Status` to the function. The object
will be populated with an array of failure locations.
```javascript
var status = new as.Status();
as({ a : Number }).matches({ a : '1' }, status);
// => status.failures is ['object.a.number']
```

## ✓ alternatives
https://www.npmjs.com/package/joi
http://json-schema.org/
