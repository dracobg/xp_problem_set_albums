var express = require('express');
var router = express.Router();

const db = require('../config/database');
var albumsCollection = db.get('albums')
    /* GET home page. */


router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'OMG Albums',
        link: 'let me see the RIGHT NOW!',
        linkURL: '/albums'
    });
});



/* GET home page. */


router.get('/albums', function(req, res, next) {

    var albums = albumsCollection.find({}, (err, data) => {
        res.render(
            'albums/index', {
                albums: data,

                title: 'Albums',
                link: 'New Album',
                linkURL: '/albums/new'
            }
        )

    });
});

router.get('/:id', function(req, res, next) {
    albumsCollection.findOne({
        _id: req.params.id
    }, function(err, foundAlbum) {
        if (err) throw err
        res.render('albums/show', {
            album: foundAlbum
        })
    })
});




router.delete('/:id', function(req, res) {
    albumsCollection.remove({
        _id: req.params.id
    }, function(err, foundAlbum) {
        if (err) throw err
        res.redirect('/albums')
    })
});

router.get('/:id/edit', function(req, res, next) {
    albumsCollection.findOne({
        _id: req.params.id
    }, function(err, foundAlbum) {
        if (err) throw err
        res.render('albums/edit', {
            album: foundAlbum,
            genres: [{
                name: 'Ska'
            }, {
                name: 'Rock'
            }, {
                name: 'Pop'
            }]
        })
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
            name: 'Rock'
        }, {
            name: 'Pop'
        }],

        //link: 'let me see the RIGHT NOW!',
        //linkURL: '/albums
    });
});


module.exports = router;
