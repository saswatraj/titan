var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    res.render('index/home', {title: 'Example', albums:[{
        albumArt: '/cdn/small/2019/9/24/DSC_0069.jpg',
        albumTitle: 'Luminous Signals',
        albumSubtitle: 'The Day it Started'
    },{
        albumArt: '/cdn/small/2019/9/24/DSC_0069.jpg',
        albumTitle: 'Emerald City',
        albumSubtitle: 'In love with rain'
    }, {
        albumArt: '/cdn/small/2019/9/24/DSC_0069.jpg',
        albumTitle: 'Example Title',
        albumSubtitle: 'California'
    }, {
        albumArt: '/cdn/small/2019/9/24/DSC_0069.jpg',
        albumTitle: 'Luminous Signals',
        albumSubtitle: 'The Day it Started'
    },{
        albumArt: '/cdn/small/2019/9/24/DSC_0069.jpg',
        albumTitle: 'Emerald City',
        albumSubtitle: 'In love with rain'
    }, {
        albumArt: '/cdn/small/2019/9/24/DSC_0069.jpg',
        albumTitle: 'Example Title',
        albumSubtitle: 'California'
    }] });
});

module.exports = router;