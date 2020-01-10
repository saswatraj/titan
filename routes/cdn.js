var express = require('express');
var AWS = require("aws-sdk");
var fs = require('fs')

var router = express.Router();

const CLOUDFRONT_PRIVATE_KEY = "ssl/pk-APKAJZVXH7QOJW7K75AA.pem";
const KEY_PAIR_ID = "APKAJZVXH7QOJW7K75AA";
const PRIVATE_KEY = fs.readFileSync(CLOUDFRONT_PRIVATE_KEY, {encoding: 'utf8'});
const CLOUDFRONT_DOMAIN = "http://d2aj2nmg3vjc13.cloudfront.net";

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
        else console.log("Signed url: " + data);
        res.redirect(data);
    });
});

module.exports = router;