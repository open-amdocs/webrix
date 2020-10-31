import {terser} from 'rollup-plugin-terser';
import base from './rollup.base';
import postcss from 'rollup-plugin-postcss';

export default [
    {
        ...base,
        output: {
            file: 'build/webrix.cjs.js',
            format: 'cjs',
            sourcemap: true,
        },
        plugins: [
            ...base.plugins(),
            postcss({sourceMap: true}),
        ],
    },
    {
        ...base,
        output: {
            file: 'build/webrix.cjs.min.js',
            format: 'cjs',
            plugins: [terser()]
        },
        plugins: [
            ...base.plugins(),
            postcss({minimize: true}),
        ],
    }
];