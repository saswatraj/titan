var express = require('express');
var multer  = require('multer');
var fs = require('fs');
var upload = multer({ dest: '/tmp/' });
var imgHelper = require('../helpers/imageHelper.js');
var s3Helper = require('../helpers/s3Helper.js');
var firehoseHelper = require('../helpers/firehoseHelper.js');
var fbHelper = require('../helpers/facebookHelper.js');
var esHelper = require('../helpers/elasticSearchHelper.js');
const uuidv1 = require('uuid/v1');

var router = express.Router();

router.get("/newimage", function(req, res, next){
    res.render('admin/index', {title: 'Example'});
});

/**
 * This route will process a large resoultion image and create multi resolution images.
 * The resoultion images would be the following:
 * - thumbnail images - small in the size of insta/facebook images
 * - medium images - medium size images for web
 */
var uploadFiles = upload.fields([{ name: 'largeResImg', maxCount: 1 }, { name: 'rawImg', maxCount: 1 }])
router.post('/process', uploadFiles, function(req, res, next){
    console.log(req.files);
    console.log(req.body);

    var largeResImg = req.files['largeResImg'][0];
    var rawImg = req.files['rawImg'][0];

    console.log("---both files---");
    console.log(largeResImg);
    console.log(rawImg);
    console.log("----------------");

    var date = new Date();
    var keySuffix = date.getFullYear() + '/' 
                        + date.getMonth() + '/' 
                        + date.getDate() + '/' ;

    var esDetails = {} // object to store ddb details

    if(req.body.id){
        esDetails['albumId'] = req.body.id;
    }else{
        esDetails['albumId'] = uuidv1();
    }

    esDetails['caption'] = req.body.caption;
    esDetails['description'] = req.body.description;
    esDetails['pathRaw'] = 'raw/' +  keySuffix + rawImg.originalname;
    esDetails['pathSmall'] = 'small/' + keySuffix + largeResImg.originalname;
    esDetails['pathMedium'] = 'medium/' + keySuffix + largeResImg.originalname;
    esDetails['mimetype'] = largeResImg.mimetype;
    esDetails['rawMimeType'] = rawImg.mimetype;
    esDetails['isAlbumCover'] = req.body.isAlbumCover === 'on'
    esDetails['isAlbum'] = req.body.isAlbum === 'on'
    esDetails['albumTitle'] = req.body.albumTitle
    esDetails['albumSubtitle'] = req.body.albumSubTitle
    esDetails['tags'] = req.body.tags.split(",")

    console.log(esDetails);

    // upload raw file to S3
    fs.readFile(rawImg.path, function(err, data){
        if(err) console.log(err)
        else {
            s3Helper.uploadBinaryDataToS3(data, {
                BucketName: 'saswat-photo-repo',
                Key: 'raw/' + keySuffix + rawImg.originalname,
                Mimetype: rawImg.mimetype,
                Filename: rawImg.originalname
            }, function(s3UploadData1){
                console.log(s3UploadData1);
                console.log("Large img: ");
                console.log(largeResImg);
                // scale large resolution image and upload
                imgHelper.scaleImgSmallBuffer(largeResImg, function(err, smallImg){
                    s3Helper.uploadBinaryDataToS3(smallImg, {
                        BucketName: 'saswat-photo-repo',
                        Key: 'small/' + keySuffix + largeResImg.originalname,
                        Mimetype: largeResImg.mimetype,
                        Filename: largeResImg.originalname
                    }, function(s3UploadData2){
                        console.log("Uploaded small image");
                        console.log(s3UploadData2);
                        // scale to medium and upload

                        imgHelper.scaleImgMediumBuffer(largeResImg, function(err, mediumImg){
                            s3Helper.uploadBinaryDataToS3(mediumImg, {
                                BucketName: 'saswat-photo-repo',
                                Key: 'medium/' + keySuffix + largeResImg.originalname,
                                Mimetype: largeResImg.mimetype,
                                Filename: largeResImg.originalname
                            }, function(s3UploadData3){
                                console.log("Uploaded medium image");
                                console.log(s3UploadData3);
                                // create entry in ddb

                                firehoseHelper.writeToEsStream(esDetails, function(firehoseDetails){
                                    console.log(firehoseDetails);
                                    res.json({'albumId': esDetails['albumId']});
                                });
                            });
                        });
                    });
                });

            });
        }
    });
});

router.get('/search', function(req, res, next){
    var results = [];
    esHelper.searchForKeyword(req.query.keyword, function(result){
        var key;
        var promises = [];
        var resultSet = new Set(result);
        console.log(resultSet);
        resultSet.forEach(function(rs){
            promises.push(s3Helper.getFileFromS3(rs, true));
        });
        Promise.all(promises).then(function(values){
            res.json(values);
        });
    });
});

router.get('/download', function(req, res, next){
    var promise = s3Helper.getFileFromS3(req.query.key, false);
    promise.then(function(data){
        res.setHeader( 'Content-Disposition', 'attachment; filename=' + data.filename );
        res.setHeader( 'Content-Type', data.mimetype );
        res.end(data.data);
    });
});

module.exports = router;