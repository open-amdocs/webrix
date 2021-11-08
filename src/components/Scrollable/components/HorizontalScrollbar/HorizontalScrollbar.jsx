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

import React, {useContext, useMemo, useRef} from 'react';
import Movable from 'components/Movable';
import Context from '../../Scrollable.context';
import {move} from './HorizontalScrollbar.operations';
import './HorizontalScrollbar.scss';
import {propTypes} from '../VerticalScrollbar/VerticalScrollbar.props';

const HorizontalScrollbar = ({xRef}) => {
    let track = useRef();
    track = xRef || track;
    const thumb = useRef();
    const {container} = useContext(Context);
    const props = Movable.useMove(useMemo(() => [move(container, thumb, track)], [container]));

    const handleOnClick = e => {
        e.stopPropagation();
        // Ignore clicks on the thumb itself
        if (!thumb.current.contains(e.target)) {
            const {left, width} = track.current.getBoundingClientRect();
            const {scrollWidth} = container.current;
            const ratio = (e.clientX - left) / width;
            container.current.style.scrollBehavior = 'smooth';
            container.current.scrollLeft = ratio * scrollWidth;
            container.current.style.scrollBehavior = ''; // Remove smooth scrolling as it breaks the thumb dragging
        }
    };

    return (
        <div className='scrollbar-track horizontal-scrollbar-track' ref={track} onClick={handleOnClick}>
            <Movable className='scrollbar-thumb' ref={thumb} {...props}>
                <div className='scrollbar-thumb-inner'/>
            </Movable>
        </div>
    );
};

HorizontalScrollbar.propTypes = propTypes;

export default HorizontalScrollbar;