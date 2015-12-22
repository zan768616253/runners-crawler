var fs = require('fs');
var ejs = require('ejs');
var path = require('path');
var querystring = require('querystring');
var url = require('url');
var log4js = require('log4js');
var root = path.join(__dirname, '../');

var headInfo = {
    'Server': 'node.js',
    'X-Powered-By': '768616253@qqcom'
};

var Routes = function() {
    this.gets = {};
    this.posts = {};
}

Routes.prototype.views = function(path, model){
    var body;
    try {

    } catch (error) {
        return;
    }
}

module.exports = function() {
    return new Routes();
}