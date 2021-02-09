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

import React, {forwardRef, memo} from 'react';
import cls from 'classnames';
import {mouseTracker, touchTracker, moveTracker} from './Movable.utils';
import {propTypes, defaultProps} from './Movable.props';
import './movable.scss';

export const Movable = forwardRef(({onBeginMove, onMove, onEndMove, ...props}, ref) => {
    const tracker = moveTracker(onBeginMove, onMove, onEndMove);
    const handleOnMouseDown = mouseTracker(tracker);
    const handleOnTouchStart = touchTracker(tracker);

    return (
        <div {...props} ref={ref} onMouseDown={handleOnMouseDown} onTouchStart={handleOnTouchStart} className={cls('movable', props.className)}/>
    );
});

Movable.displayName = 'Movable';
Movable.propTypes = propTypes;
Movable.defaultProps = defaultProps;

export default memo(Movable);
