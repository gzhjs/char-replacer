var preProcess = require('../index.js');

var config = {
    src: './*',
    dest: './dest/*',
    charMap: {
        'Node.js': 'node'
    }
};
preProcess(config);