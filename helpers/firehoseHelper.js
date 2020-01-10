var AWS = require("aws-sdk");
const fs = require('fs');

// if (fs.existsSync('./config.json')) {
//     AWS.config.loadFromPath('./config.json');
// }

const FIREHOSE_DELIVERY_STREAM = "photometadata";

var firehose = new AWS.Firehose({region: 'us-west-2'});

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