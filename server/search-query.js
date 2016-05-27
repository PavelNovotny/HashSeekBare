/**
 *
 * Created by pavelnovotny on 27.05.16.
 */
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: "search-query"});


exports.parseParams = function (req) {
    var seekStrings = [];
    for (i = 0; i< req.query.seekStrings.length-1; i++) { //seekStrings je vždy větší jak 1 a poslední je prázdný
       seekStrings.push(JSON.parse(req.query.seekStrings[i]));
    }
    var params = {
        "search" :seekStrings,
        "date": req.query.date,
        "days": req.query.searchDays,
        "env" : JSON.parse(req.query.env),
        "logs" : JSON.parse(req.query.logs),
        "last" : req.query.last
    };
    return params;
}
