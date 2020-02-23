var AWS = require("aws-sdk");
// Create sendEmail params 
var params = {
    Destination: { /* required */
      CcAddresses: [
        'saswatraj@outlook.com'
      ],
      ToAddresses: [
        'saswatrj2010@gmail.com'
      ]
    },
    Message: { /* required */
       Subject: {
        Charset: 'UTF-8',
        Data: 'Message from Saswat Photography Website'
       }
      },
    Source: 'saswatraj@outlook.com' /* required */
  };

var sendEmail = function(req, callbackSuccess, callbackErr){
    params['Message']['Body'] = {
        Html: {
            Charset: "UTF-8",
            Data: getFormattedEmailBody(req)
        }
    }
    var sendPromise = new AWS.SES({apiVersion: '2010-12-01',region: 'us-west-2'}).sendEmail(params).promise();
    sendPromise.then(function(data){
        console.log("Sent message with id: " + data.MessageId);
        if(callbackSuccess) callbackSuccess(data);
    }).catch(function(err){
        console.error(err, err.stack);
        if(callbackErr) callbackErr(err);
    });
}

var getFormattedEmailBody = function(data){
    var heading = "";
    var fromAdd = "";
    if(data.inputName){
        fromAdd = data.inputName;
    }else{
        fromAdd = data.inputEmail;
    }
    heading = "<div>Message from <b>"+ fromAdd + "</b></div>";

    var message = "<div><u><b>Message:</b></u><br/><span style='width:500px;'>";
    message += data.inputMessage;
    message += "</span></div>";

    var message = heading + message;
    if(data.inputName || data.inputPhone){
        var contact = "<div><u><b>Contact:</b></u><br/>";
        if(data.inputName){
            contact += "<u>Name:</u> " +  data.inputName + "<br/>";
        }
        if(data.inputPhone){
            contact += "<u>Number:</u> " +  data.inputPhone + "<br/>";
        }
        message += contact;
    }
    
    return message;
}

module.exports = {
    sendEmail: sendEmail
}
