var Jimp = require('jimp');

const CANON_SMALL_SCALING_FACTOR = 0.1
const CANON_MEDIUM_SCALING_FACTOR = 0.4

var scaleImgSmall = function(file, callback){
    Jimp.read(file.path, (err, img) => {
    if (err) throw err;
    else img.scale(CANON_SMALL_SCALING_FACTOR).getBase64(file.mimetype, callback);
    });
}

var scaleImgMedium = function(file, callback){
    Jimp.read(file.path, (err, img) => {
    if (err) throw err;
    else img.scale(CANON_MEDIUM_SCALING_FACTOR).getBase64(file.mimetype, callback);
    });
}

var scaleImgSmallBuffer = function(file, callback){
    Jimp.read(file.path, (err, img) => {
    if (err) throw err;
    else img.scale(CANON_SMALL_SCALING_FACTOR).getBuffer(file.mimetype, callback);
    });
}

var scaleImgMediumBuffer = function(file, callback){
    Jimp.read(file.path, (err, img) => {
    if (err) throw err;
    else  img.scale(CANON_MEDIUM_SCALING_FACTOR).getBuffer(file.mimetype, callback);
    });
}

module.exports = {
    scaleImgSmall: scaleImgSmall,
    scaleImgMedium: scaleImgMedium,
    scaleImgSmallBuffer: scaleImgSmallBuffer,
    scaleImgMediumBuffer: scaleImgMediumBuffer
}
