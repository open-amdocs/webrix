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
import {init, lock, update} from './Resizable.constraints';

export const useResize = ({constraints = [], ...args}) => {
    const shared = useRef({});
    const dependencies = constraints.reduce((acc, cur) => acc.concat(cur.dependencies), []);
    const ops = [init(), ...constraints, lock(), update()];

    const onBeginResize = useCallback(e => {
        ops.forEach(({onBeginResize}) => onBeginResize(e, args, shared.current));
    }, dependencies);

    const onResize = useCallback(e => {
        ops.forEach(({onResize}) => onResize(e, args, shared.current));
    }, dependencies);

    const onEndResize = useCallback(e => {
        ops.forEach(({onEndResize}) => onEndResize(e, args, shared.current))
    }, dependencies);

    return {onBeginResize, onResize, onEndResize};
};