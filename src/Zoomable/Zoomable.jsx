import React, {memo, forwardRef} from 'react';
import classNames from 'classnames';
import {propTypes, defaultProps} from './Zoomable.props';
import './Zoomable.scss';

export const Zoomable = forwardRef(({zoom, style, className, ...props}, ref) => (
    <div {...props}
        ref={ref}
        className={classNames('zoomable', className)}
        style={{
            ...style,
            transform: `scale(${zoom})`,
        }}/>
));

Zoomable.displayName = 'Zoomable';
Zoomable.propTypes = propTypes;
Zoomable.defaultProps = defaultProps;

export default memo(Zoomable);
