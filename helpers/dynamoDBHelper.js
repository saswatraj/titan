var AWS = require("aws-sdk");

var credentials = new AWS.SharedIniFileCredentials({profile: 'saswat-dev'});
AWS.config.credentials = credentials;
AWS.config.update({region: 'us-west-2'});

const uuidv1 = require('uuid/v1');

var dynamodb = new AWS.DynamoDB();

var addRecordToDynamoDB = function(options){
    var _id = uuidv1();
    var params = {
        Item: { 
            "id": {
                S: _id
            }, 
            "caption": {
                S: options.caption
            },
            "description": {
                S: options.description 
            },
            "pathSmall": {
                S: options.pathSmall
            },
            "pathMedium": {
                S: options.pathMedium
            }
        }, 
        TableName: "photo-metadata-v1"
    };
    // add 
    dynamodb.putItem(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
}

module.exports = {
    addRecordToDynamoDB: addRecordToDynamoDB
}