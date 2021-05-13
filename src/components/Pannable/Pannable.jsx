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

import React, {forwardRef, useCallback, useRef, useMemo} from 'react';
import cls from 'classnames';
import {copyComponentRef} from 'utility/react';
import Movable from '../Movable';
import Scrollable from '../Scrollable';
import {propTypes, defaultProps} from './Pannable.props';
import './Pannable.scss';

export const Pannable = forwardRef(({children, className, ...props}, ref) => {
    const scrollRef = useRef();
    const pannableRef = useRef();
    const initial = useMemo(() => ({top: 0, left: 0}), []);

    const handleOnBeginMove = useCallback(() => {
        // TODO: accessing the inner structure of scrollbar is bad practice
        // this is just a temporary solution until Scrollbar will expose its inner ref via forwardRef
        const scrollbar = scrollRef.current.container.current;
        scrollbar.style.scrollBehavior = 'auto';
        initial.top = scrollbar.scrollTop;
        initial.left = scrollbar.scrollLeft;
        pannableRef.current.classList.add('dragging');
    }, [initial]);

    const handleOnMove = useCallback(({ dx, dy}) => {
        const scrollbar = scrollRef.current.container.current;
        const {top, left} = initial;
        scrollbar.scrollTop = top - dy;
        scrollbar.scrollLeft = left - dx;
    }, [initial]);

    const handleOnEndMove = useCallback(() => {
        pannableRef.current.classList.remove('dragging');
        scrollRef.current.container.current.style.scrollBehavior = '';
    }, [pannableRef]);

    return (
        <div {...props} className={cls('pannable', className)} ref={copyComponentRef(ref, pannableRef)}>
            <Scrollable ref={scrollRef}>
                <Movable
                    onMove={handleOnMove}
                    onBeginMove={handleOnBeginMove}
                    onEndMove={handleOnEndMove}>
                    {children}
                </Movable>
            </Scrollable>
        </div>
    )
});

Pannable.displayName = 'Pannable';
Pannable.propTypes = propTypes;
Pannable.defaultProps = defaultProps;

export default Pannable;
