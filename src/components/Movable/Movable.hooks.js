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

import {useRef, useCallback} from 'react';
import {init, update} from './Movable.constraints';

export const useMove = ({constraints = [], ...args}) => {
    const shared = useRef({});
    const dependencies = constraints.reduce((acc, cur) => acc.concat(cur.dependencies), []).concat(Object.values(args));
    const ops = [init(), ...constraints, update()];

    const onBeginMove = useCallback(e => {
        ops.forEach(({onBeginMove}) => onBeginMove(e, args, shared.current));
    }, dependencies);

    const onMove = useCallback(e => {
        ops.forEach(({onMove}) => onMove(e, args, shared.current));
    }, dependencies);

    const onEndMove = useCallback(e => {
        ops.forEach(({onEndMove}) => onEndMove(e, args, shared.current))
    }, dependencies);

    return {onBeginMove, onMove, onEndMove};
};