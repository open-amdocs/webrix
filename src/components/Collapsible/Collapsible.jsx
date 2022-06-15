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

import React, {useState, useCallback, useEffect, useRef} from 'react';
import classNames from 'classnames';
import {propTypes, defaultProps} from './Collapsible.props';
import './Collapsible.scss';

export const NAMESPACE = 'collapsible';

export const Collapsible = ({expanded, children, onTransitionEnd, ...props}) => {
    const [{motion, height}, setState] = useState({motion: '', height: expanded ? 'auto' : 0});
    const hasChildren = !!React.Children.count(children);
    const contentRef = useRef();
    const mounted = useRef();
    const handleOnTransitionEnd = useCallback(e => {
        // 'transform' is the longest transition property out of multiple ones
        if (e.propertyName === 'transform') {
            setState(state => ({...state, motion: '', height: state.height ? 'auto' : 0}));
            onTransitionEnd(e);
        }
    }, [onTransitionEnd]);

    useEffect(() => {
        mounted.current && setState({
            height: contentRef.current.clientHeight, // if was "auto" - measure again and change
            motion: expanded ? 'expanding' : 'collapsing',
        });

        mounted.current = true;
    }, [expanded]);

    useEffect(() => {
        // forces repaint so the next part will only take affect after previous height
        // change and not have React merge both setStates
        document.body.scrollTop;

        if (motion === 'collapsing')
            setState(state => ({...state, height: 0}))
    }, [motion]);

    const className = classNames(
        NAMESPACE, // base namespace selector
        {
            [`${NAMESPACE}--${motion}`]: motion, // temporary state for transitions (BEM modifier name)
            [`${NAMESPACE}--expanded`]: expanded && !motion,
        },
        props.className
    );

    return (
        <div {...props} className={className} style={{...props.style, height}} onTransitionEnd={handleOnTransitionEnd}>
            {hasChildren && <div className={`${NAMESPACE}__content`} ref={contentRef}>{children}</div>}
        </div>
    );
};

Collapsible.propTypes = propTypes;
Collapsible.defaultProps = defaultProps;

export default Collapsible;
