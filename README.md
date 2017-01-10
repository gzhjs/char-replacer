### replacer
一个字符替换器。可以批量处理所有指定文件中的字符。比如，你想把所有文件里的一些特殊字符处理掉，可以试试它。

### 安装
用npm: `npm install replacer --save-dev`

用yarn: `yarn add --dev`

### 使用

```
var replacer = require('replacer');
var config = {
    src: './src',
    dest: './dest',
    '<': '&lt;'
};
replacer(config);
```

关于config:

- src是原路径，可制定单个文件，也可制定一批文件，当然通配符也是可以的
  1. 你好
  2. hah
-