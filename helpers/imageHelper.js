var Jimp = require('jimp');
var fs = require( 'fs' );

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

var createImageFromBinaryString = function(binaryString, imgName, mimetype, callback){
    var imagePath = '/tmp/' + imgName;
    var wstream = fs.createWriteStream(imagePath);
    wstream.on( 'finish', function() {
        callback({
            path: imagePath,
            mimetype: mimetype
        });
    });
    wstream.write(binaryString);
    wstream.end();
};

var createImageFromBase64 = function(base64Data, imgName, mimetype, callback){
    var imagePath = '/tmp/' + imgName;
    fs.writeFile(imagePath, base64Data, 'base64', function(err){
        if(err) console.log(err);
        else callback({
            path: imagePath,
            mimetype: mimetype
        });
    })
};

module.exports = {
    scaleImgSmall: scaleImgSmall,
    scaleImgMedium: scaleImgMedium,
    scaleImgSmallBuffer: scaleImgSmallBuffer,
    scaleImgMediumBuffer: scaleImgMediumBuffer,
    createImageFromBinaryString: createImageFromBinaryString,
    createImageFromBase64: createImageFromBase64
}
