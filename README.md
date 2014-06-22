
# Miscue [![Build Status](https://travis-ci.org/decanat/miscue.svg?branch=master)](https://travis-ci.org/decanat/miscue)

Miscue class for Decanat, to provide better interface to HTTP errors and status in general.

```js
var Miscue = require('miscue');
// instantiate
var status = new Miscue(422, { email: 'improper' });
// play
status instanceof Error; // returns true
alert(status); // alerts 'client error (422): {"email":"improper"}'
```

## Installation

  Install with [component](http://component.io):

    $ component install decanat/miscue

## API

#### Set custom name ####

```js
var status = new Miscue(422, { email: 'improper' });
// status.name === 'client error'

status.set('validation error');
// status.name === 'validation error'

status.set(422);
// status.name === 'client error'
```

#### Mark as Error ####

```js
var status = new Miscue(600, 'coffee break');
// status instanceof Error === false

status.turnError();
// status instanceof Error === true
```

## Testing

To test with PhantomJS, run:

    $ make test    


## License

  The MIT License (MIT)
