/**
 *
 * Created by pavelnovotny on 12.05.16.
 */

var express = require("express");
var path = require("path");
var cors = require("cors");
var app = express();
var request = require("request");

app.use(cors());

//dev
app.get("/app", function(req, res) {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.static(path.join(__dirname, '../.tmp')));

//production
// app.get("/app", function(req, res) {
//     res.sendFile(path.join(__dirname, '../dist', 'index.html'));
// });
// app.use(express.static(path.join(__dirname, '../dist')));


app.get('/api/search', function(req, res) {
    res.json({pozdrav:'ahoj', pozdrav:'čau'});
});

//proxy that does not wait for response finish (feeds browser immediatelly)
var proxied = ['/processCommand','/download','/hashSeek','/authenticate','/result','/sessions','/logFilesInfo'];

app.use(function(req, res) {
    if (proxied.indexOf(req.path) != -1) {
        var newurl = 'http://lxcipppt401.ux.to2cz.cz:7002' + req.originalUrl;
        req.pipe(request[req.method.toLowerCase()](newurl)).pipe(res);
    }
});

app.listen(8000).on('error', function(err) {
    console.error(err);
});
