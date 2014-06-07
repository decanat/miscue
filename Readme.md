
# Miscue

Miscue class for Decanat, to provide better interface to HTTP errors and status in general.

    var Miscue = require('miscue');
    // instantiate
    var status = new Miscue(422, { email: 'improper' });
    // play
    status instanceof Error; // returns true
    alert(status); // alerts 'client error (422): {"email":"improper"}'

## Installation

  Install with [component](http://component.io):

    $ component install decanat/miscue

## API

#### Set custom name ####

    var status = new Miscue(422, { email: 'improper' });
    // status.name === 'client error'

    status.set('validation error');
    // status.name === 'validation error'
    
    status.set(422);
    // status.name === 'client error'

#### Mark as Error ####

    var status = new Miscue(600, 'coffee break');
    // status instanceof Error === false
    
    status.turnError();
    // status instanceof Error === true

#### Extend ####

    var MiningST = Miscue.extend({
            isEnough: function(){
                return this.code >= 2500;
            }
        });

    var status = new MiningST();

    status.set(2400);
    status.isEnough(); // false

    status.set(2500);
    status.isEnough(); // true


## License

  The MIT License (MIT)
