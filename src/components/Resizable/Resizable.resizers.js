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

import React, {useCallback, memo} from 'react';
import Movable from '../Movable';
import {NAMESPACE} from './Resizable';
import {propTypes} from './Resizable.props';

const INITIAL = {top: 0, left: 0, width: 0, height: 0};
const getDisplayName = (name) => NAMESPACE.replace(/(wx-.)/, v => v.toUpperCase()) + `.Resizer.${name}`;

const Resizer = ({direction, onBeginResize, onResize, onEndResize}) => (
    <Movable
        className={`${NAMESPACE} ${direction}-resizer`}
        onBeginMove={onBeginResize}
        onMove={onResize}
        onEndMove={onEndResize}/>
);

Resizer.propTypes = propTypes;

const createResizer = (name, getResizeProps) => {
    const Comp = memo(props => {
        const {onResize} = props;
        const handleOnResize = useCallback((arg) => onResize(getResizeProps(arg)), [onResize]);
        return <Resizer {...props} onResize={handleOnResize} direction={name.toLowerCase()}/>;
    });

    Comp.propTypes = propTypes;
    Comp.displayName = getDisplayName(name.replace(/-/g, ''));

    return Comp;
};

const Top = createResizer('Top', ({dy, cy}) => ({
    delta: {...INITIAL, top: dy, height: -dy},
    change: {...INITIAL, top: cy, height: -cy},
}));

const Left = createResizer('Left', ({dx, cx}) => ({
    delta: {...INITIAL, left: dx, width: -dx},
    change: {...INITIAL, left: cx, width: -cx},
}));

const Bottom = createResizer('Bottom', ({dy, cy}) => ({
    delta: {...INITIAL, height: dy},
    change: {...INITIAL, height: cy},
}));

const Right = createResizer('Right', ({dx, cx}) => ({
    delta: {...INITIAL, width: dx},
    change: {...INITIAL, width: cx},
}));

const TopLeft = createResizer('Top-Left', ({dx, dy, cx, cy}) => ({
    delta: {left: dx, width: -dx, top: dy, height: -dy},
    change: {left: cx, width: -cx, top: cy, height: -cy},
}));

const TopRight = createResizer('Top-Right', ({dx, dy, cx, cy}) => ({
    delta: {...INITIAL, width: dx, top: dy, height: -dy},
    change: {...INITIAL, width: cx, top: cy, height: -cy},
}));

const BottomLeft = createResizer('Bottom-Left', ({dx, dy, cx, cy}) => ({
    delta: {...INITIAL, left: dx, width: -dx, height: dy},
    change: {...INITIAL, left: cx, width: -cx, height: cy},
}));

const BottomRight = createResizer('Bottom-Right', ({dx, dy, cx, cy}) => ({
    delta: {...INITIAL, width: dx, height: dy},
    change: {...INITIAL, width: cx, height: cy},
}));

const All = memo(props => (
    [Top, Left, Bottom, Right, TopLeft, TopRight, BottomLeft, BottomRight]
        .map((Resizer, i) => <Resizer key={i} {...props}/>)
));

All.propTypes = propTypes;
All.displayName = getDisplayName('All');

export default {Top, Left, Bottom, Right, TopLeft, TopRight, BottomLeft, BottomRight, All};