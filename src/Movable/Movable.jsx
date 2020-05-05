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

import React, {forwardRef, memo} from 'react';
import PropTypes from 'prop-types';
import {noop} from 'utility/memory';

export const track = ({onBeginMove, onMove, onEndMove}) => {

    let initial = {};
    let previous = {};

    const sanitizeEvent = e => {
        const {clientX: x, clientY: y, target} = e;
        return ({
            x,
            y,
            target,
            cx: x - previous.x,
            cy: y - previous.y,
            dx: x - initial.x,
            dy: y - initial.y,
            stopPropagation: () => e.stopPropagation(),
            preventDefault: () => e.preventDefault(),
        });
    };

    const handleOnMouseMove = e => {
        onMove(sanitizeEvent(e));
        previous = {x: e.clientX, y: e.clientY};
    };

    const handleOnMouseUp = e => {
        document.removeEventListener('mousemove', handleOnMouseMove);
        document.removeEventListener('mouseup', handleOnMouseUp);
        onEndMove(sanitizeEvent(e));
    };

    /* handleOnMouseDown */
    return e => {
        initial = {x: e.clientX, y: e.clientY};
        previous = {...initial};
        document.addEventListener('mousemove', handleOnMouseMove);
        document.addEventListener('mouseup', handleOnMouseUp);
        onBeginMove(sanitizeEvent(e));
    };
};

export const Movable = forwardRef(({onBeginMove, onMove, onEndMove, ...props}, ref) => (
    <div {...props} ref={ref} onMouseDown={track({onBeginMove, onMove, onEndMove})}/>
));

Movable.displayName = 'Movable';

Movable.propTypes = {
    onBeginMove: PropTypes.func,
    onMove: PropTypes.func,
    onEndMove: PropTypes.func,
};

Movable.defaultProps = {
    onBeginMove: noop,
    onMove: noop,
    onEndMove: noop,
};

export default memo(Movable);
