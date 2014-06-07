
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

  Copyright (c) 2014 Mushex Antaranian

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
