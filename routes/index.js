var express = require('express');
var router = express.Router();

var albumsCollection = require('../config/database').get('albums');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'OMG Albums',
        link: 'let me see the RIGHT NOW!',
        linkURL: '/albums'
    });
});

router.get('/albums', function(req, res, next) {

    albumsCollection.find({}, function(err, result) {
        if (err) throw err;
        res.render('albums/index', {
            title: 'Albums',
            link: 'New Album',
            linkURL: '/albums/new',
            albums: result
        });
    })
});

router.post('/albums', function(req, res, next) {
    console.log('body=', req.body)
    albumsCollection.insert(req.body, function(err, docs) {
        console.log('err=', err, 'docs=', docs)
        if (err) return next(err);
        res.redirect('/albums')
    })
})

router.get('/albums/new', function(req, res, next) {
    res.render('albums/newalbum', {
        title: 'Create Albums',
        genres: [{
                name: 'Ska'
            }, {
                name: 'rock'
            }]
            //link: 'let me see the RIGHT NOW!',
            //linkURL: '/albums
    });
});


module.exports = router;
