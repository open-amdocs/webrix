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

import React, {memo, forwardRef, useRef, useEffect, useCallback} from 'react';
import cx from 'classnames';
import {copyComponentRef} from 'utility/react';
import ResizeObserver from 'tools/ResizeObserver';
import {propTypes, defaultProps} from './Scalable.props';
import './Scalable.scss';

export const NAMESPACE = '{{PREFIX}}scalable';

export const Scalable = forwardRef(({scalex, scaley, className, children, ...props}, ref) => {
    const inner = useRef();
    const outer = useRef();

    const updateDimensions = useCallback(() => {
        const {clientWidth: width, clientHeight: height} = inner.current;
        outer.current.style.width = `${width * scalex}px`;
        outer.current.style.height = `${height * scaley}px`;
    }, [scalex, scaley]);

    useEffect(() => {
        updateDimensions();
    }, [updateDimensions]);

    return (
        <div {...props} ref={copyComponentRef(ref, outer)} className={cx(NAMESPACE, className)}>
            <ResizeObserver onResize={updateDimensions}>
                <div className={`${NAMESPACE}-inner`} style={{transform: `scale(${scalex}, ${scaley})`}} ref={inner}>
                    {children}
                </div>
            </ResizeObserver>
        </div>
    )
});

Scalable.displayName = 'Scalable';
Scalable.propTypes = propTypes;
Scalable.defaultProps = defaultProps;

export default memo(Scalable);
