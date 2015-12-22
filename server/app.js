var cp = require('child_process');
var http = require('http');
var net = require('net');
var fs = require('fs');
var path = require('path');
var url = require('url');
var WebSocketServer = require('ws').Server;
var ejs = require('ejs');

var MIME_TYPES = require('../util/mime.js');

global.ROOT = path.join(__dirname, '../');
global.utils = require('../util/utils.js');
global.routes = require('./routes.js')();

var worker;

module.exports = function(ports){

}
