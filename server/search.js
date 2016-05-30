/**
 * 
 * Created by pavelnovotny on 25.05.16.
 */
var hashReader = require('hash-reader');
var searchQuery = require('./search-query');
var searchFiles = require('./search-files');
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: "search"});
log.level("info");


exports.search = function search(req, res, nconf) {
    var params = searchQuery.parseParams(req);
    var searchFiles = searchFiles.searchFiles(nconf, params);
    hashReader.seek(params.search[0][0], seekedFile, 10,function(err, result) {
        if (err) {
            log.error(err);
        }
        log.info("Result:",result);
        res.json({pozdrav:'ahoj', pozdrav1: result[0]});
    });
}

