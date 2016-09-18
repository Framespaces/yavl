# yavl
Yet Another Validation Language (for JavaScript)

... but this one is _beautiful_.

```javascript
var as = require('yavl');

var schema = as({
  name : String,
  age : Number
});

schema.matches({
  name : 'Fred',
  age : 40
}); // => true

schema.coerce({
  name : 'Fred',
  age : '40'
}); // => { name : 'Fred', age : 40 }

schema.validate({
  name : 'Fred',
  age : '40'
}); // => throws TypeError
```
