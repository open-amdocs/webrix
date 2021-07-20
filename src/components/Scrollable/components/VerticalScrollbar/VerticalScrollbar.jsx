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

import React from 'react';
import {oneOfType, node, func, shape, instanceOf} from 'prop-types';
import {Element} from 'utility/mocks';
import {noop} from 'utility/memory';
import Movable from 'components/Movable';
import './VerticalScrollbar.scss';

export default class VerticalScrollbar extends React.PureComponent {

    static propTypes = {
        container: oneOfType([
            func,
            shape({current: instanceOf(Element)}),
        ]),
        onUpdate: func,
        children: node,
    };

    static defaultProps = {
        container: {},
        onUpdate: noop,
        children: null,
    };

    track = React.createRef();
    thumb = React.createRef();

    handleOnBeginMove = e => {
        e.stopPropagation();
        e.preventDefault();
        this.initialScroll = this.props.container.current.scrollTop;
    };

    handleOnMove = ({dy}) => {
        const container = this.props.container.current;
        const {clientHeight, scrollHeight} = container;
        const handleHeight = this.thumb.current.clientHeight;
        const trackHeight = this.track.current.clientHeight;
        container.scrollTop = this.initialScroll + dy * (scrollHeight - clientHeight) / (trackHeight - handleHeight);
    };

    handleOnClick = e => {
        // Ignore clicks on the thumb itself
        if (!this.thumb.current.contains(e.target)) {
            const container = this.props.container.current;
            const track = this.track.current;
            const {top, height} = track.getBoundingClientRect();
            const {scrollHeight} = this.props.container.current;
            const ratio = (e.clientY - top) / height;
            container.style.scrollBehavior = 'smooth';
            container.scrollTop = ratio * scrollHeight;
            container.style.scrollBehavior = ''; // Remove smooth scrolling as it breaks the thumb dragging
        }
    };

    update() {
        const container = this.props.container.current;
        const track = this.track.current;
        const thumb = this.thumb.current;

        if (this.isScrollable()) {
            this.props.onUpdate(track, thumb, container);
            track.classList.add('visible');
        } else {
            track.classList.remove('visible');
        }
    }

    isScrollable() {
        const {clientHeight, scrollHeight} = this.props.container.current;
        return clientHeight !== scrollHeight;
    }

    render() {
        return (
            <div className='scrollbar-track vertical-scrollbar-track' ref={this.track} onClick={this.handleOnClick}>
                <Movable className='scrollbar-thumb' ref={this.thumb} onBeginMove={this.handleOnBeginMove} onMove={this.handleOnMove}>
                    <div className='scrollbar-thumb-inner'/>
                </Movable>
                {this.props.children}
            </div>
        );
    }
}
