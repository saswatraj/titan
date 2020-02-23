var express = require('express');
var router = express.Router();

router.get("/", function(req, res, next){
    res.render('prints/index', {title: 'Prints', activeTab: 'prints'});
});

module.exports = router;