import {production as cjs} from './rollup.cjs';
import {production as es} from './rollup.es';
import {production as umd} from './rollup.umd';

export default [
    cjs,
    es,
    umd,
];