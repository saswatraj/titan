var express = require('express');
var throttle = require("express-throttle");
var sesHelper = require("../helpers/sesHelper");

var router = express.Router();

router.get("/", function(req, res, next){
    res.render('contact/index', {title: 'Contact', activeTab: 'contact'});
});

router.post("/sendMessage", throttle({ "rate": "1/60s" }), function(req, res, next){
    sesHelper.sendEmail(req.body, function(){
        res.sendStatus(200);
    }, function(){
        res.sendStatus(500);
    });
});

module.exports = router;