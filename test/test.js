var preProcess = require('../index.js');

var config = {
    src: './test_src.txt',
    dest: './dest/test_dest.txt',
    charMap: {
        'Node.js': 'node'
    }
};
preProcess(config);