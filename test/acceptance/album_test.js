var http = require('http');
var expect = require('chai').expect;
var app = require('../../app');

before(function() {
    var server = http.createServer(app);
    server.listen(0);
    browser.baseUrl = 'http://localhost:' + server.address().port;
    browser.ignoreSynchronization = true;
});

describe('Express CRUD', function() {
    describe('Given I visit /users', function() {
        it('Then I see the express default', function() {
            browser.get('/users');
            element(by.tagName('body')).getText().then(function(text) {
                expect(text).to.equal('respond with a resource');
            });
        });

    });
});


describe('Express CRUD', function() {
    describe('When i visit /', function() {
        it('Then I see the OMG header', function() {
            browser.get('/');
            element(by.tagName('h1')).getText().then(function(headertext) {
                expect(headertext).to.equal('OMG Albums');
            });
        });

        it('Then I see the OMG link', function() {
            browser.get('/');
            element(by.tagName('a')).getText().then(function(text) {
                expect(text).to.equal('let me see the RIGHT NOW!');
            });
        });
    });

    describe('When i visit /albums', function() {
        var db = require('../../config/database').get('albums');
        var album = {
            genre: 'Honus Wagner',
            artist: 'Pittsburgh Pirates',
            album: 'American Tobacco Company',
            stars: 5,
            lyrics: true
        };

        before(function(done) {
            db.insert(album, done);
        });



        it('Then I see the albums header', function() {
            browser.get('/albums');
            element(by.tagName('h3')).getText().then(function(headertext) {
                expect(headertext).to.equal('Albums');
            });
        });

        it('Then I see the new albums link', function() {
            browser.get('/albums');
            element(by.tagName('a')).getText().then(function(text) {
                expect(text).to.equal('New Album');
            });
        });

        it('Then I see the albums table', function() {
            browser.get('/albums');

            browser.wait(function() {
                return ptor.isElementPresent(availableElement);
            }, 30000);

            element(by.tagName('td')).getText().then(function(text) {
                console.log(text);
                expect(text).to.equal('Honus Wagner');
            });
        });

        after(function() {
            db.remove({});
        });
    });


    describe('Express CRUD', function() {
        describe('Given I visit /albums/new', function() {
            it('Then I see the new albums url page', function() {
                browser.get('/albums/new');

                element(by.id('artist')).sendKeys("Calvin Harris");
                element(by.id('album')).sendKeys("Greatest hits");
                element(by.id('submit')).click().then(function() {
                    //console.log(element(by.tagName('tr')));
                    element.all(by.tagName('td')).getText().then(function(text) {
                        console.log(text)
                        expect(text[1]).to.equal('Calvin Harris');
                    });
                });

            });

        });
    });

});
