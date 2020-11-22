import React, {useState, memo, forwardRef} from 'react';
import {getCurrentBreakpoint} from 'utility/screen';
import {isEmpty} from 'utility/types';
import Poppable from '../../Poppable';
import {propTypes, defaultProps} from './Adjustable.props';
import AdjustableContext from './Adjustable.context';
import './Adjustable.scss';

export const AdjustablePoppable = forwardRef(({style, sizes, ...props}, ref) => {
    const [boundingRect, setBoundingRect] = useState({});
    const [placement, setPlacement] = useState();
    const _sizes = sizes[getCurrentBreakpoint()];
    return (
        <AdjustableContext.Provider value={{boundingRect, setBoundingRect, sizes: _sizes, placement}}>
            <Poppable {...props} style={{...style, ..._sizes}} placement={isEmpty(boundingRect) ? placement : boundingRect} onPlacement={setPlacement} ref={ref}/>
        </AdjustableContext.Provider>
    );
});

AdjustablePoppable.displayName = 'Poppable.Adjustable';
AdjustablePoppable.propTypes = propTypes;
AdjustablePoppable.defaultProps = defaultProps;

export default memo(AdjustablePoppable);
