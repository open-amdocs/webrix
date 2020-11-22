import {node, func, shape, number, instanceOf, oneOfType} from 'prop-types';
import {noop} from 'utility/memory';
import defaultOverflow from './Poppable.overflow';
import {HIDDEN_PLACEMENT} from './Poppable.constants';

export const propTypes = {
    container: oneOfType([
        func,
        shape({current: oneOfType([instanceOf(Element), instanceOf(window.constructor)])}),
    ]),
    reference: oneOfType([
        func,
        instanceOf(DOMRect),
        shape({current: instanceOf(Element)}),
    ]),
    placements: func,
    placement: shape({
        top: number,
        left: number,
    }),
    overflow: func,
    onPlacement: func,
    default: number,
    children: node,
};

export const defaultProps = {
    container: {current: window},
    reference: {current: document.body},
    placements: () => [{top: 0, left: 0}],
    placement: HIDDEN_PLACEMENT,
    overflow: defaultOverflow,
    onPlacement: noop,
    default: 0,
    children: null,
};
