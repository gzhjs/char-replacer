var fs = require('fs');
var childProcess = require('child_process');
var through2 = require('through2');

var readStream;
var writeStream;
var processor;
// 根据目标文件路径和目的路径进行字符替换
var processFunc = function(src, dest, charMap) {
    fs.access(dest, function(err) {
        // 如果目的文件不存在，则创建
        if (err) {
            var reg = /((?:[^\/]+\/)*)([^\/]*\.[a-z]+)$/;
            var matchRes = dest.match(reg);
            console.log('=====: ', dest, matchRes);
            var filePath = matchRes[1];
            childProcess.exec('mkdir -p ' + filePath);
            childProcess.exec('touch ' + dest);
        }
        readStream = fs.createReadStream(src);
        writeStream = fs.createWriteStream(dest);
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

var replacer = function(config) {
    var charMap = config.charMap;
    var asteriskReg = /(?:\.)?\/\*$/;
    // 没有明确指明目标目录则取config.src为目标目录
    config.dest = config.dest || config.src;

    if (asteriskReg.test(config.src)) {
        var srcPath = config.src.replace(asteriskReg, '');
        var srcFiles = fs.readdirSync(srcPath || __dirname);
        var srcFilePath;
        var destFilePath;
        srcFiles.forEach(function(fPath, index) {
            if (!fs.statSync(fPath).isDirectory()) {
                destFilePath = (config.dest.replace(asteriskReg, '') || __dirname) + '/' + fPath;
                srcFilePath = (srcPath || __dirname) + '/' + fPath;
                processFunc(srcFilePath, destFilePath, charMap);
            }
        });
    } else {
        processFunc(config.src, config.dest, charMap);
    }
};

module.exports = replacer;
