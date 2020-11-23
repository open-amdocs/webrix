/**
 * Copyright (c) 2020, Amdocs Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
