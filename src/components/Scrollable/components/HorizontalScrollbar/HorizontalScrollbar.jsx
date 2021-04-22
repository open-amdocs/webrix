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
import Movable from '../../../Movable';
import {onUpdate} from './HorizontalScrollbar.utils';
import './HorizontalScrollbar.scss';

export default class HorizontalScrollbar extends React.PureComponent {

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
        onUpdate: onUpdate,
        children: null,
    };

    track = React.createRef();
    thumb = React.createRef();

    handleOnBeginMove = e => {
        e.stopPropagation();
        e.preventDefault();
        this.initialScroll = this.props.container.current.scrollLeft;
        this.props.container.current.style.scrollBehavior = 'auto'; // Remove smooth scrolling as it breaks the thumb dragging behavior
    };

    handleOnMove = ({dx}) => {
        const container = this.props.container.current;
        const {clientWidth, scrollWidth} = container;
        const handleWidth = this.thumb.current.clientWidth;
        container.scrollLeft = this.initialScroll + dx * ((scrollWidth - clientWidth) / (clientWidth - handleWidth));
    };

    handleOnEndMove = () => {
        this.props.container.current.style.scrollBehavior = 'smooth';
    };

    handleOnClick = e => {
        // Ignore clicks on the thumb itself
        if (!this.thumb.current.contains(e.target)) {
            const container = this.props.container.current;
            const track = this.track.current;
            const {left, width} = track.getBoundingClientRect();
            const {scrollWidth} = this.props.container.current;
            const ratio = (e.clientX - left) / width;
            container.scrollLeft = ratio * scrollWidth;
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
        const {clientWidth, scrollWidth} = this.props.container.current;
        return clientWidth !== scrollWidth;
    }

    render() {
        return (
            <div className='scrollbar-track horizontal-scrollbar-track' ref={this.track} onClick={this.handleOnClick}>
                <Movable className='scrollbar-thumb' ref={this.thumb} onBeginMove={this.handleOnBeginMove} onMove={this.handleOnMove} onEndMove={this.handleOnEndMove}>
                    <div className='scrollbar-thumb-inner'/>
                </Movable>
                {this.props.children}
            </div>
        );
    }
}
