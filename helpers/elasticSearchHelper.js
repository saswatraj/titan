var AWS = require("aws-sdk");
const fs = require('fs');

// if (fs.existsSync('./config.json')) {
//     AWS.config.loadFromPath('./config.json');
// }

const es = require('elasticsearch').Client({
    hosts: [ 'http://3.136.104.162:9200' ],
    log: 'trace'
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
                bool: {
                    must: [{
                        term: {
                            isAlbumCover: true
                        }
                    },{
                        term: {
                            isAlbum: true
                        }
                    }]
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
                var source = hits[index]['_source'];
                searchResults.push({
                    albumId: source['albumId'],
                    albumArt: '/cdn/' + source['pathMedium'],
                    albumTitle: source['albumTitle'],
                    albumSubtitle: source['albumSubtitle']
                });
            }
            console.log("Search results: " + searchResults);
            callback(searchResults);
        }
    });
};

var getAlbumForId = function(id, callback){
    var _query = {
        index: 'photo-metadata-v1',
        body: {
            query:{
                match: {
                    albumId: id
                }
            }
        }
    };
    console.log(_query);
    var result = {};
    es.search(_query, (err, result) => {
        if(err) console.log(err)
        else {
            var hits = result['hits']['hits'];
            var index;
            var albumArt = new Set();
            for(index in hits){
                var source = hits[index]['_source'];
                if(source['albumId'] != id) continue;
                if(source['isAlbumCover']){
                    result['albumLeadArt'] = '/cdn/' + source['pathLarge'],
                    result['albumTitle'] = source['albumTitle']
                    result['albumSubtitle'] = source['albumSubtitle']
                    result['albumDescription'] = source['description']
                    result['tags'] = source['tags']
                }else{
                    albumArt.add('/cdn/' + source['pathMedium']);
                }
            }
            result['albumArts'] = Array.from(albumArt);
            result['albumId'] = id;
            console.log("Search results: " + result);
            callback(result);
        }
    });
};

var indexDocument = function(document, callback){
    es.index({
        index: 'photo-metadata-v1',
        type: '_doc',
        body: document
    }, callback);
}

module.exports = {
    getAlbumForId: getAlbumForId,
    getAlbums: getAlbums,
    searchForKeyword: searchForKeyword,
    indexDocument: indexDocument
}