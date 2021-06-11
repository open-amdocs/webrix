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

import React, {useRef, useMemo, useState} from 'react';
import ReactDOM from 'react-dom';
import cls from 'classnames';
import Movable from '../Movable';
import {propTypes, defaultProps} from './Draggable.props';
import {update} from './Draggable.operations';
import './Draggable.scss';

const {move} = Movable.Operations;

export const Draggable = ({children, canDrag, onBeginDrag, onDrag, onDrop, onBeginHover, onEndHover, dragImage, ...props}) => {
    const movable = useRef();
    const [rect, setRect] = useState();
    const movableProps = Movable.useMove(useMemo(() => [
        move(movable),
        update(movable, setRect, canDrag, onBeginDrag, onDrag, onDrop),
    ], [movable, setRect, canDrag, onBeginDrag, onDrag, onDrop]));

    return (
        <>
            {rect && ReactDOM.createPortal((
                <div className={cls('draggable clone', props.className)} style={{...rect}}>
                    {dragImage ? dragImage : children}
                </div>
            ), document.body)}
            <Movable
                {...props}
                {...movableProps}
                ref={movable}
                className={cls('draggable', props.className)}
                onMouseEnter={onBeginHover}
                onMouseLeave={onEndHover}>
                {children}
            </Movable>
        </>
    );
};

Draggable.displayName = 'Draggable';
Draggable.propTypes = propTypes;
Draggable.defaultProps = defaultProps;

export default Draggable;