var express = require('express');
var router = express.Router();

router.get("/", function(req, res, next){
    res.render('contact/index', {title: 'Contact', activeTab: 'contact'});
});

module.exports = router;