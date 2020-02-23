var express = require('express');
var multer  = require('multer');
var fs = require('fs');
var upload = multer({ dest: '/tmp/' });
var imgHelper = require('../helpers/imageHelper.js');
var s3Helper = require('../helpers/s3Helper.js');
var esHelper = require('../helpers/elasticSearchHelper.js');
const uuidv1 = require('uuid/v1');

var router = express.Router();

router.get("/createalbum", function(req, res, next){
    res.render('admin/createalbum', {title: 'Create Album'});
});

/**
 * This route will process a large resoultion image and create multi resolution images.
 * The resoultion images would be the following:
 * - thumbnail images - small in the size of insta/facebook images
 * - medium images - medium size images for web
 */
router.post('/process', function(req, res, next){
    var params = req.body;

    var date = new Date();
    var keySuffix = date.getFullYear() + '/' 
                        + date.getMonth() + '/' 
                        + date.getDate() + '/' ;

    var esDetails = {} // object to store ddb details

    if(req.body.id){
        esDetails['albumId'] = params.id;
    }else{
        esDetails['albumId'] = uuidv1();
    }

    esDetails['caption'] = params.caption;
    esDetails['description'] = params.description;
    esDetails['pathRaw'] = 'raw/' +  keySuffix + params.rawImgName;
    esDetails['pathSmall'] = 'small/' + keySuffix + params.largeImgName;
    esDetails['pathMedium'] = 'medium/' + keySuffix + params.largeImgName;
    esDetails['pathLarge'] = 'large/' + keySuffix + params.largeImgName;
    esDetails['rawMimeType'] = params.rawImgMimetype;
    esDetails['mimetype'] = params.largeImgMimetype;
    esDetails['isAlbumCover'] = params.isAlbumCover === 'on'
    esDetails['isAlbum'] = params.isAlbum === 'on'
    esDetails['albumTitle'] = params.albumTitle
    esDetails['albumSubtitle'] = params.caption
    esDetails['tags'] = params.tags.split(",")

    console.log(esDetails);

    var rawImgBase64 = params.rawImg.replace(/^data:image\/[^;]*;base64,/, "");
    var largeImgBase64 = params.largeImg.replace(/^data:image\/[^;]*;base64,/, "");

    var rawImgBuffer = new Buffer(rawImgBase64, 'base64');
    var largeImgBuffer = new Buffer(largeImgBase64, 'base64'); 

    imgHelper.createImageFromBase64(largeImgBase64, 
        params.largeImgName,
        params.largeImgMimetype,
        function(largeImg){
            //upload raw data to s3
            s3Helper.uploadBinaryDataToS3(rawImgBuffer, {
                BucketName: 'saswat-photo-repo-v1',
                Key: esDetails['pathRaw'],
                Mimetype: esDetails['rawMimeType'],
                Filename: params.rawImgName
            }, function(rawImageUploadMetadata){
                console.log("Uploaded raw image !!");
                // upload large image to s3
                s3Helper.uploadBinaryDataToS3(largeImgBuffer, {
                    BucketName: 'saswat-photo-repo-v1',
                    Key: esDetails['pathLarge'],
                    Mimetype: esDetails['mimetype'],
                    Filename: params.largeImgName
                }, function(largeImageUploadMetadata){
                    console.log("Uploaded large image !!");
                    // convert large image to medium size
                    imgHelper.scaleImgMediumBuffer(largeImg,
                        function(err, mediumImage){
                            // upload medium image to s3
                            s3Helper.uploadBinaryDataToS3(mediumImage, {
                                BucketName: 'saswat-photo-repo-v1',
                                Key: esDetails['pathMedium'],
                                Mimetype: esDetails['mimetype'],
                                Filename: params.largeImgName
                            }, function(mediumImageUploadMetadata){
                                console.log("Uploaded medium image !!");
                                // convert large image to small size
                                imgHelper.scaleImgSmallBuffer(largeImg,
                                    function(err, smallImage){
                                        //upload small image to s3
                                        s3Helper.uploadBinaryDataToS3(smallImage, {
                                            BucketName: 'saswat-photo-repo-v1',
                                            Key: esDetails['pathSmall'],
                                            Mimetype: esDetails['mimetype'],
                                            Filename: params.largeImgName
                                        },function(smallImageUploadMetadata){
                                            console.log("Uploaded small image !!");
                                            // write details to elastic search
                                            esHelper.indexDocument(esDetails, 
                                                function(data1, data2){
                                                console.log("Written to es index !!");
                                            });

                                            res.json({
                                                albumId: esDetails['albumId']
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
});

router.get('/updatealbum/:id', function(req, res, next){
    var ablumId = req.params.id;
    esHelper.getAlbumForId(ablumId, function(result){
        res.render('admin/addtoalbum', result);
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