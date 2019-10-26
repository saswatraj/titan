var express = require('express');
var AWS = require("aws-sdk");
var fs = require('fs')

var router = express.Router();

const CLOUDFRONT_PRIVATE_KEY = "ssl/pk-APKAI4ILXKAD2K7KQNTQ.pem";
const KEY_PAIR_ID = "APKAI4ILXKAD2K7KQNTQ";
const PRIVATE_KEY = fs.readFileSync(CLOUDFRONT_PRIVATE_KEY, {encoding: 'utf8'});
const CLOUDFRONT_DOMAIN = "https://cdn.saswatraj.com";

var awsCloudFrontSigner = new AWS.CloudFront.Signer(KEY_PAIR_ID, PRIVATE_KEY);

router.get("*", function(req, res, next){
    var currentTime = new Date();
    var expires = new Date();
    expires.setMinutes(currentTime.getMinutes() + 5);

    var url = CLOUDFRONT_DOMAIN + req.path;
    awsCloudFrontSigner.getSignedUrl({
        url: url,
        expires: expires.getTime()
    }, function(err,data){
        if(err) console.log(err);
        res.redirect(data);
    });
});

module.exports = router;