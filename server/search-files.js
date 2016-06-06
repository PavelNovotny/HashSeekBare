/**
 * Created by pavelnovotny on 27.05.16.
 */
var bunyan = require('bunyan');
var dateformat = require('dateformat');
var log = bunyan.createLogger({name: "search-files"});

exports.filesToSearch = function (nconf, jsonBody) {
    var dates = datesToSearch(jsonBody.date, jsonBody.searchDays);
    var confFiles = nconf.get("files");
    var result = [];
    for (var envIter = 0; envIter < jsonBody.env.length; envIter++) {
        for (var serverIter = 0; serverIter < jsonBody.servers.length; serverIter++) {
            var dataFolder = confFiles[jsonBody.env[envIter]].folders[jsonBody.servers[serverIter]].data;
            var hashFolder = confFiles[jsonBody.env[envIter]].folders[jsonBody.servers[serverIter]].hash;
            var nodes = confFiles[jsonBody.env[envIter]].nodes[jsonBody.servers[serverIter]];
            for (var nodeIter = 0; nodeIter < nodes.length; nodeIter++) {
                for (var logIter = 0; logIter < jsonBody.logs.length; logIter++) {
                    var pattern = confFiles[jsonBody.env[envIter]].patterns[jsonBody.servers[serverIter]][jsonBody.logs[logIter]];
                    for (var dateIter = 0; dateIter < dates.length; dateIter++) {
                        result.push(fileToSearch(dataFolder, hashFolder, pattern, nodes[nodeIter], dates[dateIter]));
                    }
                }
            }
        }
    }
    return result;
}

function fileToSearch(dataFolder, hashFolder, pattern, node, date) {
    return {
        dataFile :{
            bgzFile: dataFolder+node+pattern+date+".bgz",
            bgzIndexFile: hashFolder +node+pattern+date+".bgz.ind"
        },
        hashFile :{
            bgzFile: hashFolder +node+pattern+date+".bgz.hash_v1.bgz",
            bgzIndexFile: hashFolder +node+pattern+date+".bgz.hash_v1.bgz.ind"
        }
    };
}

function datesToSearch(dateString, days) {
    var result = [];
    var date = new Date(dateString);
    var today = dateformat(new Date(), 'yyyymmdd');
    while (days-- > 0) {
        var fileDate = dateformat(date, 'yyyymmdd');
        if (today === fileDate) { //vytvoříme hodinové
           for (i=0; i<24; i++) {
               var fileHour;
               if (i<10) {
                   fileHour = fileDate + '.0' + i;
               } else {
                   fileHour = fileDate + '.' + i;
               }
               result.push(fileHour);
           }
        } else {
            result.push(fileDate);
        }
        date.setDate(date.getDate() + 1);
    }
    return result;
}

