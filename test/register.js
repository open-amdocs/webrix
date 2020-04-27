const {resolve} = require('path');

require('@babel/register')({
    only: [
        resolve(__dirname, '../src'),
        resolve(__dirname),
    ],
    // plugins: [
    //     'istanbul',
    // ],
});