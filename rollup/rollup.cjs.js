import base from './rollup.base';
import postcss from 'rollup-plugin-postcss';

export default [
    {
        ...base,
        output: {
            dir: 'build/cjs',
            format: 'cjs',
            preserveModules: true,
            preserveModulesRoot: 'src',
            sourcemap: true,
            exports: 'named',
        },
        plugins: [
            ...base.plugins(),
            postcss({sourceMap: true}),
        ],
    }
];