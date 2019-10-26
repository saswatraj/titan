var AWS = require("aws-sdk");

var credentials = new AWS.SharedIniFileCredentials({profile: 'saswat-dev'});
AWS.config.credentials = credentials;
AWS.config.update({region: 'us-west-2'});

const es = require('elasticsearch').Client({
    hosts: [ 'https://search-photometadata-qrfom74s5l7mhndnh6fezpxidi.us-west-2.es.amazonaws.com' ],
    connectionClass: require('http-aws-es')
});

var searchForKeyword = function(keyword, callback){
    var _query = {
        index: 'photo-metadata-v1',
        body: {
            query: {
                match: {
                    caption: keyword
                }
            }
        }
    };
    console.log(_query);
    es.search(_query, (err, result) => {
        if(err) console.log(err)
        else {
            var searchResults = [];
            var hits = result['hits']['hits'];
            var index;
            for(index in hits){
                searchResults.push(hits[index]['_source']['pathSmall']);
            }
            console.log("Search results: " + searchResults);
            callback(searchResults);
        }
    })
};

var getAlbums = function(callback){
    var _query = {
        index: 'photo-metadata-v1',
        body: {
            query: {
                match: {
                    caption: keyword
                }
            }
        }
    };
    console.log(_query);
    es.search(_query, (err, result) => {
        if(err) console.log(err)
        else {
            var searchResults = [];
            var hits = result['hits']['hits'];
            var index;
            for(index in hits){
                searchResults.push(hits[index]['_source']['pathSmall']);
            }
            console.log("Search results: " + searchResults);
            callback(searchResults);
        }
    })
};

module.exports = {
    searchForKeyword: searchForKeyword
}