import React, {useCallback, useContext, useRef, memo} from 'react';
import {node} from 'prop-types';
import Movable from '../../../../Movable';
import PoppableContext from '../../../Poppable.context';
import AdjustableContext from '../Adjustable.context';
import {or} from '../Adjustable.utils';

export const Handle = ({children}) => {
    const initial = useRef({});
    const {tbr} = useContext(PoppableContext);
    const {boundingRect, setBoundingRect} = useContext(AdjustableContext);

    const handleOnBeginMove = useCallback(() =>
        initial.current = {top: or(boundingRect.top, tbr.top), left: or(boundingRect.left, tbr.left)}, [boundingRect, tbr]);

    const handleOnMove = useCallback(({dx, dy}) => {
        setBoundingRect({
            ...boundingRect,
            top: or(boundingRect.top, initial.current.top) + dy,
            left: or(boundingRect.left, initial.current.left) + dx,
        });
    }, [boundingRect, setBoundingRect]);

    return (
        <Movable onBeginMove={handleOnBeginMove} onMove={handleOnMove} className='poppable-movable'>
            {children}
        </Movable>
    );
};

Handle.propTypes = {
    children: node,
};

Handle.defaultProps = {
    children: null,
};

export default memo(Handle);
