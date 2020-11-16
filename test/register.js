const {resolve} = require('path');

require('@babel/register')({
    only: [
        resolve(__dirname, '../src'),
        resolve(__dirname),
    ],
    plugins: [
        'rewire',
        resolve(__dirname, './babel-plugin-ignore-styles'),
    ],
});