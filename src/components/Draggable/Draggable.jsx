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

import React, {useRef, useMemo, useState, useContext, forwardRef} from 'react';
import ReactDOM from 'react-dom';
import cls from 'classnames';
import {omit} from 'utility/object';
import {copyComponentRef} from 'utility/react';
import Movable from '../Movable';
import {propTypes, defaultProps} from './Draggable.props';
import {update} from './Draggable.operations';
import {Context} from './Draggable.context';
import './Draggable.scss';

const {move} = Movable.Operations;

export const Draggable = forwardRef(({children, canDrag, onBeginDrag, onDrag, onDrop, onBeginHover, onEndHover, dragImage, ...props}, ref) => {
    const movable = useRef();
    const [rect, setRect] = useState();
    const context = useContext(Context);
    const movableProps = Movable.useMove(useMemo(() => [
        move(movable),
        update({ref: movable, setRect, canDrag, onBeginDrag, onDrag, onDrop, context}),
    ], [movable, setRect, canDrag, onBeginDrag, onDrag, onDrop, context]));

    return (
        <>
            {rect && ReactDOM.createPortal((
                <div className={cls('draggable clone', props.className)} style={{...rect}}>
                    {dragImage ? dragImage : children}
                </div>
            ), document.body)}
            <Movable
                {...omit(props, 'canDrop')}
                {...movableProps}
                ref={copyComponentRef(ref, movable)}
                className={cls('draggable', props.className)}
                onMouseOver={onBeginHover}
                onMouseOut={onEndHover}>
                {children}
            </Movable>
        </>
    );
});

Draggable.displayName = 'Draggable';
Draggable.propTypes = propTypes;
Draggable.defaultProps = defaultProps;

export default Draggable;