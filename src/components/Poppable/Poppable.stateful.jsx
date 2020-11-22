import React, {useState, memo, forwardRef} from 'react';
import Poppable from './Poppable';
import {propTypes, defaultProps} from './Poppable.props';

export const StatefulPoppable = forwardRef((props, ref) => {
    const [placement, setPlacement] = useState();

    return (
        <Poppable {...props} placement={placement} onPlacement={setPlacement} ref={ref}/>
    );
});

StatefulPoppable.displayName = 'Poppable';
StatefulPoppable.propTypes = propTypes;
StatefulPoppable.defaultProps = defaultProps;

export default memo(StatefulPoppable);
