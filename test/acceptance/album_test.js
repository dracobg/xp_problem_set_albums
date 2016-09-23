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

        it('Destination of link routes to /albums', function() {
            browser.get('/')
            element(by.css('a[href*="/albums"]')).getText().then(function(text) {
                expect(text).to.equal('let me see the RIGHT NOW!');
            });
        })

        it('clicking the link on / should route the browser to /album', function() {
            browser.get('/')

            element(by.css('a[href*="/albums"]')).click().then(function() {
                element(by.tagName('h3')).getText().then(function(headertext) {
                    expect(headertext).to.equal('Albums');
                });
            })
        })
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
            var album = {
                genre: 'Honus Wagner',
                artist: 'Pittsburgh Pirates',
                album: 'American Tobacco Company',
                stars: 5,
                lyrics: true
            };

            var db = require('../../config/database').get('albums');
            db.insert(album, function(err, albumStuff) {
                if (err) throw err;
                console.log("Album", album);
                console.log("=================================");
            })

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

        it('clicking the New Albums link on /albums should route the browser to /newalbum', function() {
            browser.get('/albums')
            element(by.css('a[href*="/albums/new"]')).click().then(function() {
                element(by.tagName('h4')).getText().then(function(headertext) {
                    expect(headertext).to.equal('Create Albums');
                });
            })

        })


        after(function() {
            db.remove({});
        });
    });

    describe('Behaviour for /albums/new', function() {
        it('clicking the Create Album button on /albums/new should add new album and route the browser to /albums', function() {
            browser.get('/albums/new')
            element(by.id('artist')).sendKeys("Calvin Horris");
            element(by.id('album')).sendKeys("Never Heard of It");
            element(by.cssContainingText('option', 'Rock')).click();
            element(by.id('star1')).click();
            element(by.id('offensive')).click();

            element(by.id('submit')).click().then(function() {
                element(by.tagName('h3')).getText().then(function(headertext) {
                    expect(headertext).to.equal('Albums');
                });
                element(by.cssContainingText('td', "Calvin Horris")).getText().then(function(headertext) {
                    expect(headertext).to.equal('Calvin Horris');
                });
            })

        })

        it('clicking the cancel button on /albums/new should NOT add new album while routing the browser to /albums', function() {
            browser.get('/albums/new')
            element(by.id('artist')).sendKeys("should not be in list");
            element(by.id('album')).sendKeys("blank");
            element(by.cssContainingText('option', 'Rock')).click();
            element(by.id('star1')).click();
            element(by.id('offensive')).click();

            element(by.id('cancelbutton')).click().then(function() {
                element(by.tagName('h3')).getText().then(function(headertext) {
                    expect(headertext).to.equal('Albums');
                });
                element(by.cssContainingText('td', "should not be in list")).isPresent().then(function(headertext) {
                    console.log(headertext);
                    expect(headertext).to.equal(false);
                });
            })
        })
    })

    describe('Behavior for /albums/new', function() {
        var db = require('../../config/database').get('albums');
        var album = {
            genre: 'Pop',
            artist: 'Pittsburgh Pirates',
            album: 'American Tobacco Company',
            stars: 5,
            lyrics: true
        };

        before(function(done) {
            db.insert(album, done);
        });

        it('should prepopulate the fields with the value for the record currently being inspected', function(done) {
            db.find({
                album: "American Tobacco Company"
            }, function(err, returnedValue) {
                console.log('err ', err, 'returnedValue', returnedValue)

                browser.get('/' + returnedValue[0]._id + '/edit')
                console.log('---------------', element(by.id("artist")).getCssValue().toString());
                element(by.id("artist")).getAttribute().then(function(albumText) {
                    expect(albumText).to.equal("Pittsburgh Pirates")
                });
            })

        })

        after(function() {
            db.remove({});
        });
    })


    describe('Behavior for /albums/:id/edit', function() {
        it('should allow user input via a form to modify existing albums within the database', function() {
            //     browser.get("/albums")
            //
            //     browser.wait(function() {
            //         var elementToFind = by.tagName('td');
            //         return browser.isElementPresent(elementToFind);
            //     }, 2000);
            //     console.log(3);
            //     element(by.name('link')).click().then(function() {
            //         browser.wait(function() {
            //             var elementToFind = by.id('artist')
            //             return browser.isElementPresent(elementToFind)
            //             console.log(2)
            //         }, 2000)
            //
            //         console.log(1)
            //     })
            // })
        })
    });
})
