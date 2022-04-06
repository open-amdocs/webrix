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
import {CSS_VARS} from '../../Scrollable.constants';
import {move} from './VerticalScrollbar.operations';
import './VerticalScrollbar.scss';

const VerticalScrollbar = () => {
    const track = useRef();
    const thumb = useRef();
    const {container, scrollTop, cssVarsOnTracks} = useContext(Context);
    const props = Movable.useMove([move(container, thumb, track)]);

    const handleOnClick = e => {
        e.stopPropagation();
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
        <div className='scrollbar-track vertical-scrollbar-track' style={cssVarsOnTracks ? {[CSS_VARS.scrollTop]: scrollTop} : undefined} ref={track} onClick={handleOnClick}>
            <Movable className='scrollbar-thumb' ref={thumb} {...props}>
                <div className='scrollbar-thumb-inner'/>
            </Movable>
        </div>
    );
};

export default VerticalScrollbar;
