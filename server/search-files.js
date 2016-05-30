/**
 * Created by pavelnovotny on 27.05.16.
 */

exports.searchFiles = function (nconf, params) {
    //todo podle datumu a dní hledání
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
    return params;
}
