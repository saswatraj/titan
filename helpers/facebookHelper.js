var FB = require('fb');

const FACEBOOK_APP_ID = '494710327799119';
const FACEBOOK_APP_SECRET = '618c7ba607f0c21cee252bed983293d9';
const PAGE_TOKEN = 'EAAFZCgZB8J4eoBAIuNKaiX3eqfrF2loE00F8rVTnQYvaVzHQjezFglDudfEA0Anf4z9yg7lzZAzZBAvcScQBm60NQTOaRCk0ccZClwKmcZAHo7wdxCRE4aTQ7C87VZCytSUhCwJi6XGLrsaDd5CPvPZA3YxCrC0cPQC0sMwFUtlp4SxBOMoZC0xQnGKmn2mAk6AWjO70sm014kAZDZD';

FB.setAccessToken(PAGE_TOKEN);

var fbapp = new FB.extend({ appId: FACEBOOK_APP_ID, appSecret: FACEBOOK_APP_SECRET });

var publishImgToPage = function(im, callback){
    var body = 'My first post using facebook-node-sdk';

    fbapp.api('me?fields=id,name', function (res) {
        if(!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }
        console.log(res.id);
        console.log(res.name);
    });
}

module.exports = {
    publishImgToPage: publishImgToPage
}