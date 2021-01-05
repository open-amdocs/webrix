/**
 * This script cleans the package.json file from certain fields that are
 * not required for published packages
 */
const fs = require('fs');
const pkg = require('./package.json');

delete pkg.devDependencies;
delete pkg.scripts;

fs.writeFile('package.json', JSON.stringify(pkg, null, 2), err => {
    if (err) return console.log(err);
    console.log('Cleaned up package.json');
});