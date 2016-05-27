/**
 * 
 * Created by pavelnovotny on 25.05.16.
 */
var hashReader = require('hash-reader');
var searchQuery = require('./search-query');
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: "search"});
log.level("info");


exports.search = function search(req, res, nconf) {
    var params = searchQuery.parseParams(req);
    var testDir = nconf.get("files").test.audit.data;
    var hashDir = nconf.get("files").test.audit.hash;
    var seekedFile = {
        dataFile :{
            bgzFile: testDir+"other_s2_alsb_aspect.audit.20160524.bgz",
            bgzIndexFile: hashDir +"other_s2_alsb_aspect.audit.20160524.bgz.ind"
        },
        hashFile :{
            bgzFile: hashDir+"other_s2_alsb_aspect.audit.20160524.bgz.hash_v1.bgz",
            bgzIndexFile: hashDir +"other_s2_alsb_aspect.audit.20160524.bgz.hash_v1.bgz.ind"
        }
    };
    hashReader.seek(params.search[0][0], seekedFile, 10,function(err, result) {
        if (err) {
            log.error(err);
        }
        log.info("Result:",result);
        res.json({pozdrav:'ahoj', pozdrav1: result[0]});
    });
}

