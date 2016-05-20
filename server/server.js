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

//both dev and prod
app.get("/app", function(req, res) {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});
app.use(express.static(path.join(__dirname, '../client')));
//only for dev
app.use(express.static(path.join(__dirname, '../.tmp')));

//proxy to the old application
var proxied = ['/processCommand','/download','/hashSeek','/authenticate','/result','/sessions','/logFilesInfo'];

app.use(function(req, res) {
    if (proxied.indexOf(req.path) != -1) {
        var newurl = 'http://localhost:7003' + req.originalUrl;
        req.pipe(request[req.method.toLowerCase()](newurl)).pipe(res);
    }
});

app.listen(7002).on('error', function(err) {
    console.error(err);
});

