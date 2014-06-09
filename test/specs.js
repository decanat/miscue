var Miscue = require('miscue');

describe('Itself', function () {
    it('should be proper type', function () {
        expect(Miscue)
            .to.exist
            .to.be.a('function');

        expect(Miscue.length)
            .to.equal(2);
    });
});


describe('Initialize', function () {
    var m201 = new Miscue(201, { id: 1000 }),
        m301 = new Miscue(301, 'http://google.com'),
        m401 = new Miscue(401),
        m500 = new Miscue(500, 'DB Error'),
        m001 = new Miscue(1);

    it('should have proper attributes', function(){
        expect(m201.code)
            .to.equal(201);
        expect(m201.data)
            .to.deep.equal({ id: 1000 });

        expect(m401.code)
            .to.equal(401);
        expect(m401.data)
            .to.be.an('undefined');
    });

    it('should convert to string', function(){
        expect(m001 + '').to.equal('miscue (1)');

        expect(m201 + '').to.equal('success (201): {"id":1000}');
        expect(m301 + '').to.equal('redirection (301): http://google.com');

        expect(m401 + '').to.equal('client error (401)');
        expect(m500 + '').to.equal('server error (500): DB Error');
    });

    it('should be an Error in case of 4xx, 5xx, ..', function(){
        expect(m401).to.be.instanceof(Error);
        expect(m500).to.be.instanceof(Error);

        expect(m001).not.to.be.instanceof(Error);
        expect(m201).not.to.be.instanceof(Error);
        expect(m301).not.to.be.instanceof(Error);
    });

    it('should be able to turn Error on demand', function(){
        m001.turnError();

        expect(m001).to.be.instanceof(Error);
    });

    it('should keep it\'s functionity after turning error', function(){
        expect(m401).itself
            .respondTo('set')
            .respondTo('turnError')
            .respondTo('toString');
    });
});

describe('Functionality', function(){
    it('should set name based on status code', function(){
        var m = new Miscue();

        m.set(1);
        expect(m.code)
            .to.equal(1);
        expect(m.name)
            .to.equal('miscue');

        m.set(101);
        expect(m.code)
            .to.equal(101);
        expect(m.name)
            .to.equal('informational');

        m.set(201, 'resource created');
        expect(m.name)
            .to.equal('resource created');
    });

    it('should set name when only string provided', function(){
        var m = new Miscue(500);

        m.set('internal server error');
        expect(m.name)
            .to.equal('internal server error');
    });

    it('should set proper code/name if "stringy" number provided', function(){
        var m = new Miscue();

        m.set('200');
        expect(m.name)
            .to.equal('success')
    });

    it('should check name for exact match', function(){
        var m = new Miscue(201);

        expect(m.is('success'))
            .to.be.true;

        m.set(1026, 'duplicate entry');
        expect(m.is('duplicate entry'))
            .to.be.true;
    });

    it('should check name for regex match', function(){
        var m = new Miscue(401);

        expect(m.is(/error/g))
            .to.be.true;
    });
});
