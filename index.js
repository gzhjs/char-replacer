/*
目前存在的问题：
如果特殊字符是正则里的特殊符号，比如?、*还没处理
config.src和config.dest还没处理完圈
*/
var fs = require('fs');
var childProcess = require('child_process');
var through2 = require('through2');

var readStream;
var writeStream;
var processor;

var preProcess = function(config) {
    var charMap = config.charMap;

    fs.access(config.dest, function(err) {
        // 如果目的文件不存在，则创建
        if (err) {
            var reg = /((?:[^\/]+\/)*)([^\/]+\.[a-z]{2,5})$/;
            var matchRes = config.dest.match(reg);
            var filePath = matchRes[1];
            childProcess.exec('mkdir -p ' + filePath);
            childProcess.exec('touch ' + config.dest);
        }
        readStream = fs.createReadStream(config.src);
        writeStream = fs.createWriteStream(config.dest);
        processor = through2.obj(function(fileBuf, enc, cb) {
            var content = fileBuf.toString();
            for (var p in charMap) {
                if (charMap.hasOwnProperty(p)) {
                    content = content.replace(new RegExp(p, 'gim'), charMap[p]);
                }
            }
            this.push(new Buffer(content));
        });
        readStream.pipe(processor).pipe(writeStream);
    });
};

module.exports = preProcess;
