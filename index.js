'use strict';

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./build/webrix.cjs.min.js');
} else {
    module.exports = require('./build/webrix.cjs.js');
}
