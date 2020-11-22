import React, {memo, useCallback, useContext} from 'react';
import {node} from 'prop-types';
import Resizable from '../../../../Resizable';
import PoppableContext from '../../../Poppable.context';
import AdjustableContext from '../Adjustable.context';
import {getCurrentRect} from '../Adjustable.utils';
import {getRectWithinLimitsRange} from './Resizer.utils';

export const Resizer = ({children}) => {
    const {boundingRect, setBoundingRect, sizes} = useContext(AdjustableContext);
    const {tbr} = useContext(PoppableContext);

    const handleOnResize = useCallback(({delta}) => {
        const currentRect = getCurrentRect(boundingRect, tbr);
        const inRangeRect = getRectWithinLimitsRange(delta, currentRect, sizes);
        setBoundingRect({...inRangeRect});
    }, [setBoundingRect, boundingRect, tbr]);

    return (
        <Resizable onResize={handleOnResize}>
            {children || <Resizable.Resizer.All/>}
        </Resizable>
    );
};

Resizer.propTypes = {children: node};
Resizer.defaultProps = {children: null};
Resizer.displayName = 'Poppable.Adjustable.Resizer';

export default memo(Resizer);
