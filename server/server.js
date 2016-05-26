/**
 *
 * Created by pavelnovotny on 12.05.16.
 */

var express = require("express");
var path = require("path");
var cors = require("cors");
var app = express();
var request = require("request");
var nconf = require('nconf');
var search = require('./search');

nconf.argv()
    .env()
    .defaults({ env : 'production' })
    .file({ file: 'config-'+nconf.get('env')+'.json' });

app.use(cors());

//both dev and prod
app.get("/app", function(req, res) {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});
app.use(express.static(path.join(__dirname, '../client')));

if (nconf.get('env') ==='devel') { //only in development environment
    app.use(express.static(path.join(__dirname, '../.tmp')));
}

app.get('/api/search', function(req, res) {
    search.search(req, res, nconf);
});

//proxy to the old application
var proxied = ['/processCommand','/download','/hashSeek','/authenticate','/result','/sessions','/logFilesInfo'];

app.use(function(req, res) {
    if (proxied.indexOf(req.path) != -1) {
        var newurl = nconf.get('proxied-site') + req.originalUrl;
        req.pipe(request[req.method.toLowerCase()](newurl)).pipe(res);
    }
});

app.listen(nconf.get('listen-port')).on('error', function(err) {
    console.error(err);
});

