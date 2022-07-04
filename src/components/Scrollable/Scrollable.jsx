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
import classNames from 'classnames';
import {copyComponentRef, findChildByType} from 'utility/react';
import {requestAnimationFrame} from 'utility/mocks';
import {normalizeScrollPosition} from './Scrollable.utils';
import ResizeObserver from 'tools/ResizeObserver';
import {VerticalScrollbarPlaceholder, HorizontalScrollbarPlaceholder, VerticalScrollbar, HorizontalScrollbar} from './components';
import Context from './Scrollable.context';
import {propTypes, defaultProps} from './Scrollable.props';
import {SCROLLING_CLASS_REMOVAL_DELAY, CSS_VARS} from './Scrollable.constants';
import './Scrollable.scss';

export default class Scrollable extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);
        this.container = React.createRef();
        this.event = {prev: {}, next: {}};
        this.state = {
            cssVarsOnTracks: props.cssVarsOnTracks,
            scrollTop: 0,
            scrollLeft: 0,
            container: this.container,
        }
    }

    getSnapshotBeforeUpdate() {
        const {scrollTop, scrollLeft} = this.container.current;
        return {scrollTop, scrollLeft};
    }

    componentDidMount() {
        this.updateScrollbars();
    }

    componentDidUpdate(prevProps, prevState, {scrollTop, scrollLeft}) {
        if (!this.props.scrollOnDOMChange) {
            // Sometimes DOM changes trigger a scroll by the browser.
            // On the other hand, we sometimes use the onScroll event to
            // make DOM changes. Clearly, when the two occur together,
            // it can lead to an infinite loop, since  the browser will
            // trigger another onScroll that will trigger another DOM change and so on.
            // To solve this, we get the snapshot before the DOM is updated
            // and check for a mismatch between the scrollTop before and after.
            // If such a mismatch exists, it means that the scroll
            // was done by the browser, and not the user, and therefore
            // we apply the scrollTop from the snapshot.
            this.container.current.scrollTop = scrollTop;
            this.container.current.scrollLeft = scrollLeft;
        }

        // While the <ResizeObserver/> observes dimension changes on the container,
        // this part observes changes to the dimensions of the content.
        this.updateScrollbars();
    }

    handleOnScroll = e => {
        const container = this.container.current;

        this.updateScrollbars();
        this.props.onScroll(this.event.next);

        if (e.target === container) { // Avoid adding this className on ancestors, since the scroll event bubbles up
            container.parentElement.classList.add('scrolling');
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                container.parentElement.classList.remove('scrolling');
            }, SCROLLING_CLASS_REMOVAL_DELAY);
        }
    };

    getEvent = () => {
        const container = this.container.current;

        if (!container) {
            return {};
        }

        const {clientHeight, clientWidth, scrollTop: st, scrollLeft: sl, scrollHeight, scrollWidth} = container;
        const scrollTop = Math.ceil(st);
        const scrollLeft = Math.ceil(sl);

        return {
            top: normalizeScrollPosition(scrollHeight, clientHeight, scrollTop),
            left: normalizeScrollPosition(scrollWidth, clientWidth, scrollLeft),
            scrollTop,
            scrollLeft,
            scrollHeight,
            scrollWidth,
            clientHeight,
            clientWidth,
        };
    };

    updateScrollbars = () => {
        this.event.next = this.getEvent();

        const nextEvent = this.event.next,
            prevEvent = this.event.prev,
            changed = nextEvent.clientHeight !== prevEvent.clientHeight ||
                      nextEvent.scrollHeight !== prevEvent.scrollHeight ||
                      nextEvent.clientWidth !== prevEvent.clientWidth ||
                      nextEvent.scrollWidth !== prevEvent.scrollWidth ||
                      nextEvent.top !== prevEvent.top ||
                      nextEvent.left !== prevEvent.left;

        // Ensures that updates (which are a potentially expensive operation)
        // are only executed if the applicable scroll properties have changed
        if (changed) {
            this.props.onUpdate(nextEvent);
            const el = this.container.current.parentElement;
            const vRatio = nextEvent.clientHeight / nextEvent.scrollHeight;
            const hRatio = nextEvent.clientWidth / nextEvent.scrollWidth;

            requestAnimationFrame(() => {
                el.classList.toggle('vertically-scrollable', vRatio < 1);
                el.classList.toggle('horizontally-scrollable', hRatio < 1);

                el.style.setProperty(CSS_VARS.verticalRatio, vRatio);
                el.style.setProperty(CSS_VARS.horizontalRatio, hRatio);

                this.setState(state => ({...state, scrollTop: nextEvent.top, scrollLeft: nextEvent.left}));

                if (!this.props.cssVarsOnTracks) {
                    el.style.setProperty(CSS_VARS.scrollTop, nextEvent.top);
                    el.style.setProperty(CSS_VARS.scrollLeft, nextEvent.left);
                }
            });
        }

        this.event.prev = nextEvent;
    };

    getElementProps = () => {
        const {element} = this.props;
        return {
            className: classNames('scrollbar-inner', element.props.className),
            ref: copyComponentRef(element.ref, this.container),
            onScroll: this.handleOnScroll,
        }
    };

    handleOnTransitionEnd = e => {
        // Sometimes internal dimension changes don't occur immediately due to transitions/animations.
        // These changes are not detected by the <ResizeObserver/> since they are internal, and are
        // detected too early by getSnapshotBeforeUpdate() since the transition/animation is completed
        // some time after the DOM change. This handler covers for that.
        if (['height', 'width'].includes(e.propertyName)) {
            this.updateScrollbars();
        }
    };

    render() {
        const {children, style, element} = this.props;
        const vsb = findChildByType(children, VerticalScrollbarPlaceholder);
        const hsb = findChildByType(children, HorizontalScrollbarPlaceholder);
        const content = React.Children.toArray(children).filter(child => ![VerticalScrollbarPlaceholder, HorizontalScrollbarPlaceholder].includes(child.type));

        return (
            <ResizeObserver onResize={this.updateScrollbars}>
                <div className='scrollbar' style={style} onTransitionEnd={this.handleOnTransitionEnd}>
                    {React.cloneElement(element, this.getElementProps(), content)}
                    <Context.Provider value={this.state}>
                        {vsb ? vsb.props.children : <VerticalScrollbar/>}
                        {hsb ? hsb.props.children : <HorizontalScrollbar/>}
                    </Context.Provider>
                </div>
            </ResizeObserver>
        );
    }
}
