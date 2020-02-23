var express = require('express');
var router = express.Router();

var esHelper = require('../helpers/elasticSearchHelper.js');

router.get('/', function(req, res, next){
    esHelper.getAlbums(function(albumsData){
        res.render('index/index', {title: 'Portfolio', albums: albumsData, activeTab: 'work'});
    });
});

router.get('/album', function(req, res, next){
    console.log(req);
    var ablumId = req.query.id;
    esHelper.getAlbumForId(ablumId, function(result){
        result['activeTab'] = 'work';
        res.render('album/index', result);
    });
});

module.exports = router;