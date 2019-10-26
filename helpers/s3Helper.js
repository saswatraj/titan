var AWS = require("aws-sdk");

var credentials = new AWS.SharedIniFileCredentials({profile: 'saswat-dev'});
AWS.config.credentials = credentials;

var s3 = new AWS.S3();

const PHOTO_BUCKET = "saswat-photo-repo";

/**
 * 
 * @param file 
 * @param options
 * {
 *    BucketName: <bucketName>,
 *    Key: <completeKeyName>
 * }  
 * @param callback 
 */
var uploadBinaryDataToS3 = function(data, options, callback){
    var s3Options = {
        Body: data,
        Bucket: options.BucketName,
        Key: options.Key,
        Metadata: {
            "mimetype": options.Mimetype,
            "filename": options.Filename
        }
    };
    s3.putObject(s3Options, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            callback(data);
        }
    });
}

var getFileFromS3 = function(key, inBase64){
    var promise = new Promise(function(resolve, reject){
        var params = {
            Bucket: PHOTO_BUCKET,
            Key: key
        };
        console.log("Searching for key: " + key);
        s3.getObject(params, function(err, data){
            console.log(data);
            if (err) reject(err)
            else resolve({
                key: key,
                data: inBase64? data.Body.toString('base64'): data.Body,
                mimetype: data.Metadata.mimetype,
                filename: data.Metadata.filename
            });
        });
    });
    return promise;
};

module.exports = {
    uploadBinaryDataToS3: uploadBinaryDataToS3,
    getFileFromS3: getFileFromS3
}