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

import React, {useContext, useRef} from 'react';
import Movable from 'components/Movable';
import Context from '../../Scrollable.context';
import './VerticalScrollbar.scss';

const VerticalScrollbar = () => {
    const track = useRef();
    const thumb = useRef();
    const initialScroll = useRef();
    const {container} = useContext(Context);

    const handleOnBeginMove = e => {
        e.stopPropagation();
        e.preventDefault();
        initialScroll.current = container.current.scrollTop;
    };

    const handleOnMove = ({dy}) => {
        const {clientHeight, scrollHeight} = container.current;
        const handleHeight = thumb.current.clientHeight;
        const trackHeight = track.current.clientHeight;
        container.current.scrollTop = initialScroll.current + dy * (scrollHeight - clientHeight) / (trackHeight - handleHeight);
    };

    const handleOnClick = e => {
        // Ignore clicks on the thumb itself
        if (!thumb.current.contains(e.target)) {
            const {top, height} = track.current.getBoundingClientRect();
            const {scrollHeight} = container.current;
            const ratio = (e.clientY - top) / height;
            container.current.style.scrollBehavior = 'smooth';
            container.current.scrollTop = ratio * scrollHeight;
            container.current.style.scrollBehavior = ''; // Remove smooth scrolling as it breaks the thumb dragging
        }
    };

    return (
        <div className='scrollbar-track vertical-scrollbar-track' ref={track} onClick={handleOnClick}>
            <Movable className='scrollbar-thumb' ref={thumb} onBeginMove={handleOnBeginMove} onMove={handleOnMove}>
                <div className='scrollbar-thumb-inner'/>
            </Movable>
        </div>
    );
};

export default VerticalScrollbar;