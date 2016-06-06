/**
 * 
 * Created by pavelnovotny on 25.05.16.
 */
var hashReader = require('hash-reader');
var searchFiles = require('./search-files');
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: "search"});
log.level("info");


exports.search = function search(req, res, nconf) {
    var filesToSearch = searchFiles.filesToSearch(nconf, req.body);
//todo implementovat async pattern a odstranit seekCount
    var seekCount = 0;
    for (fi = 0; fi< filesToSearch.length; fi++) {
    for (ssi = 0; ssi< req.body.seekStrings.length-1; ssi++) { //seekStrings je vždy větší jak 1 a poslední je prázdný
            seek(++seekCount, res, req.body.seekStrings[ssi][0], filesToSearch[fi]);
        }
    }
}


function seek(seekCount, res, seekString, fileToSearch)  {
    hashReader.seek(seekString, fileToSearch, 10,function(err, result) {
        if (err) {
            log.error(err);
        }
        if (seekCount === 1) {
            log.info("Result:",result);
            res.json({pozdrav:'ahoj', pozdrav1: result[0]});
        }
    });
}

