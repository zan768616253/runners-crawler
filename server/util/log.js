var log4js = require('log4js');
var fs = require("fs");
var path = require("path");

var helper = {};

// 加载配置文件
var config = JSON.parse(fs.readFileSync("log-config.json", "utf8"));

// 检查配置文件所需的目录是否存在，不存在时创建
if(config.appenders) {
    var baseDir = config.customBaseDir;
    var defaultAtt = config.customDefaultAtt;

    for(var i = 0, j = config.appenders.length; i < j; i++) {
        var item = config.appenders[i];
        if(item.type == 'console')
            continue;

        if(defaultAtt != null) {
            for(var att in defaultAtt) {
                if(item[att] == null) {
                    item[att] = defaultAtt[att];
                }
            }
        }


    }
}




exports.helper = helper;

