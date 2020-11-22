import {propTypes as _propTypes, defaultProps as _defaultProps} from '../../Poppable.props';
import {Breakpoints} from 'utility/screen';
import {shape, number} from 'prop-types';

export const propTypes = {
    ..._propTypes,
    sizes: shape(Object.keys(Breakpoints).reduce((acc, breakpoint) => {
        acc[breakpoint] = shape({
            minWidth: number,
            minHeight: number,
            maxWidth: number,
            maxHeight: number,
        });
        return acc;
    }, {})),
};

export const defaultProps = {
    ..._defaultProps,
    sizes: Object.keys(Breakpoints).reduce((acc, breakpoint) => ({...acc, [breakpoint]: {}}), {}),
};
