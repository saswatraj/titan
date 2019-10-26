var AWS = require("aws-sdk");

var credentials = new AWS.SharedIniFileCredentials({profile: 'saswat-dev'});
AWS.config.credentials = credentials;
AWS.config.update({region: 'us-west-2'});

const FIREHOSE_DELIVERY_STREAM = "photometadata";

var firehose = new AWS.Firehose();

var writeToEsStream = function(json, callback){
    var params = {
        DeliveryStreamName: FIREHOSE_DELIVERY_STREAM, /* required */
            Record: { /* required */
                Data: JSON.stringify(json) /* Strings will be Base-64 encoded on your behalf */ /* required */
            }
        };
    firehose.putRecord(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     callback(data);           // successful response
    });
};

module.exports = {
    writeToEsStream: writeToEsStream
}