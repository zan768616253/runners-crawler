/// 工具?
var querystring = require('querystring');

exports.isString = function (a) {
    return Object.prototype.toString.call(a).indexOf('String') > -1;
};

exports.isObject = function (a) {
    return Object.prototype.toString.call(a).indexOf('Object') > -1;
};

exports.extend = function (target, source, rewrite){
    if (target === null || source === null)
        return target;

    if (typeof (target) !== 'object' || typeof (source) !== 'object')
        return target;

    var keys = Object.keys(source);
    var i = keys.length;

    while (i--){
        var key = keys[i];

        if (rewrite || target[key] === undefined){
            target[key] = source[key];
        }
    }

    return target;
};

/**
 * @param {Object} obj
 * @param {String} mapping, 'a b,c d' ??性a?成b，??性c?成d
 */
exports.switchAttr = function (obj, mapping){
    if (typeof obj !== 'object' || typeof mapping !== 'string'){
        return obj;
    }
    mapping = querystring.parse(mapping, ',', ' ');

    var newobj = utils.extend({}, obj);

    var keys = Object.key(mapping);

    keys.sort(function(a, b){
        var _a = a.split('.').length;
        var _b = b.split('.').length;

        return _a > _b ? -1 : 1;
    });

    keys.forEach(function(element, index){
        if (element.indexOf('[]') > -1) {
            var start = element.match(/(.*)\.\[/)[1];
            var end = element.match(/\]\.(.*)$/)[1];
            eval('newobj.' + start).forEach(function (a, b) {
                eval('a.' + mapping[element] + '=a.' + end + ';delete a.' + end);
            });
        } else {
            eval('newobj.' + mapping[element] + '=newobj.' + element + ';delete newobj.' + element);
        }
    });

    return newobj;
};


