import {string, node, shape, arrayOf} from 'prop-types';

export const propTypes = {
    puppeteer: {
        children: node,
        props: shape({}),
        namespace: string,
    },
    break: {
        children: node,
        props: arrayOf(string),
        namespace: string,
    },
};

export const defaultProps = {
    puppeteer: {
        children: null,
        props: {},
        namespace: 'global',
    },
    break: {
        children: null,
        props: null,
        namespace: 'global',
    },
};