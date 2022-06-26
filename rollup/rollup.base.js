import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';

export default {
    input: 'src/index.js',
    external: [
        'react',
        'react-dom',
        'react-is',
        'prop-types',
        'classnames',
    ],
    plugins: () => ([// Must be a function so that plugin's instances are regenerated for every config
        replace({'{{PREFIX}}': 'wx-', preventAssignment: true, delimiters: ['', '']}),
        resolve({extensions: ['.js', '.jsx']}),
        commonjs({include: /node_modules/}),
        babel({babelHelpers: 'runtime', exclude: /node_modules/}),
    ]),
};