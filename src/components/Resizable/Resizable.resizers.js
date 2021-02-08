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
import {propTypes} from './Resizable.props';
import Movable from '../Movable';

const INITIAL = {top: 0, left: 0, width: 0, height: 0};

const Resizer = ({direction, onBeginResize, onResize, onEndResize}) => (
    <Movable
        className={`resizable ${direction}-resizer`}
        onBeginMove={onBeginResize}
        onMove={onResize}
        onEndMove={onEndResize}/>
);

Resizer.propTypes = propTypes;

const Top = memo(props => {
    const handleOnResize = useCallback(({dy, cy}) => (
        props.onResize({
            delta: {...INITIAL, top: dy, height: -dy},
            change: {...INITIAL, top: cy, height: -cy},
        })
    ), [props.onResize]);
    return (
        <Resizer {...props} onResize={handleOnResize} direction='top'/>
    );
});

Top.propTypes = propTypes;
Top.displayName = 'Resizable.Resizer.Top';

const Left = memo(props => {
    const handleOnResize = useCallback(({dx, cx}) => (
        props.onResize({
            delta: {...INITIAL, left: dx, width: -dx},
            change: {...INITIAL, left: cx, width: -cx},
        })
    ), [props.onResize]);
    return (
        <Resizer {...props} onResize={handleOnResize} direction='left'/>
    );
});

Left.propTypes = propTypes;
Left.displayName = 'Resizable.Resizer.Left';

const Bottom = memo(props => {
    const handleOnResize = useCallback(({dy, cy}) => (
        props.onResize({
            delta: {...INITIAL, height: dy},
            change: {...INITIAL, height: cy},
        })
    ), [props.onResize]);
    return (
        <Resizer {...props} onResize={handleOnResize} direction='bottom'/>
    );
});

Bottom.propTypes = propTypes;
Bottom.displayName = 'Resizable.Resizer.Bottom';

const Right = memo(props => {
    const handleOnResize = useCallback(({dx, cx}) => (
        props.onResize({
            delta: {...INITIAL, width: dx},
            change: {...INITIAL, width: cx},
        })
    ), [props.onResize]);
    return (
        <Resizer {...props} onResize={handleOnResize} direction='right'/>
    );
});

Right.propTypes = propTypes;
Right.displayName = 'Resizable.Resizer.Right';

const TopLeft = memo(props => {
    const handleOnResize = useCallback(({dx, dy, cx, cy}) => (
        props.onResize({
            delta: {left: dx, width: -dx, top: dy, height: -dy},
            change: {left: cx, width: -cx, top: cy, height: -cy},
        })
    ), [props.onResize]);
    return (
        <Resizer {...props} onResize={handleOnResize} direction='top-left'/>
    );
});

TopLeft.propTypes = propTypes;
TopLeft.displayName = 'Resizable.Resizer.TopLeft';

const TopRight = memo(props => {
    const handleOnResize = useCallback(({dx, dy, cx, cy}) => (
        props.onResize({
            delta: {...INITIAL, width: dx, top: dy, height: -dy},
            change: {...INITIAL, width: cx, top: cy, height: -cy},
        })
    ), [props.onResize]);
    return (
        <Resizer {...props} onResize={handleOnResize} direction='top-right'/>
    );
});

TopRight.propTypes = propTypes;
TopRight.displayName = 'Resizable.Resizer.TopRight';

const BottomLeft = memo(props => {
    const handleOnResize = useCallback(({dx, dy, cx, cy}) => (
        props.onResize({
            delta: {...INITIAL, left: dx, width: -dx, height: dy},
            change: {...INITIAL, left: cx, width: -cx, height: cy},
        })
    ), [props.onResize]);
    return (
        <Resizer {...props} onResize={handleOnResize} direction='bottom-left'/>
    );
});

BottomLeft.propTypes = propTypes;
BottomLeft.displayName = 'Resizable.Resizer.BottomLeft';

const BottomRight = memo(props => {
    const handleOnResize = useCallback(({dx, dy, cx, cy}) => (
        props.onResize({
            delta: {...INITIAL, width: dx, height: dy},
            change: {...INITIAL, width: cx, height: cy},
        })
    ), [props.onResize]);
    return (
        <Resizer {...props} onResize={handleOnResize} direction='bottom-right'/>
    );
});

BottomRight.propTypes = propTypes;
BottomRight.displayName = 'Resizable.Resizer.BottomRight';

const All = memo(props => (
    [Top, Left, Bottom, Right, TopLeft, TopRight, BottomLeft, BottomRight].map((Resizer, i) => (
        <Resizer key={i} {...props}/>
    ))
));

All.propTypes = propTypes;
All.displayName = 'Resizable.Resizer.All';

export default {Top, Left, Bottom, Right, TopLeft, TopRight, BottomLeft, BottomRight, All};