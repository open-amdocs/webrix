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
import {noop} from 'utility/memory';

export const operation = props => ({
    dependencies: [],
    onBeginMove: noop,
    onMove: noop,
    onEndMove: noop,
    ...props,
});

export const base = (ops = [], args) => {
    const shared = useRef({});
    const dependencies = ops.reduce((acc, cur) => acc.concat(cur.dependencies), []).concat(Object.values(args));

    const onBeginMove = useCallback(e => {
        ops.forEach(({onBeginMove}) => onBeginMove(e, args, shared.current));
    }, dependencies);

    const onMove = useCallback(e => {
        ops.forEach(({onMove}) => onMove(e, args, shared.current));
    }, dependencies);

    const onEndMove = useCallback(e => {
        ops.forEach(({onEndMove}) => onEndMove(e, args, shared.current))
    }, dependencies);

    return {onBeginMove, onMove, onEndMove, ref: args.ref};
};

export const useMove = ({constraints = [], ...args}) => {
    const before = operation({
        onBeginMove: (e, {ref}, shared) => {
            const {top, left} = ref.current.getBoundingClientRect();
            shared.next = {top, left};
            shared.initial = {top, left};
        },
        onMove: ({dx, dy}, args, {next, initial})=> {
            const {left, top} = initial;
            next.left = left + dx;
            next.top = top + dy;
        },
    });
    const after = operation({
        onMove: (e, {onMove}, {next}) => {
            onMove({
                top: Math.round(next.top),
                left: Math.round(next.left),
            });
        },
    });
    const ops = [before, ...constraints, after];
    return base(ops, args);
};

export const useMoveArea = ({constraints = [], ...args}) => {
    const before = operation({
        onBeginMove: ({x, y}, {ref, onMove}, shared) => {
            shared.initial = ref.current.getBoundingClientRect();
            shared.next = {left: x - shared.initial.left, top: y - shared.initial.top};
            onMove({
                top: Math.round(shared.next.top),
                left: Math.round(shared.next.left),
            });
        },
        onMove: ({x, y}, args, shared) => {
            shared.next.left = Math.round(x - shared.initial.left);
            shared.next.top = Math.round(y - shared.initial.top);
        },
    });
    const after = operation({
        onMove: (e, {onMove}, {next, initial}) => {
            next.left = Math.min(Math.max(next.left, 0), initial.width);
            next.top = Math.min(Math.max(next.top, 0), initial.height);

            onMove({
                top: Math.round(next.top),
                left: Math.round(next.left),
            });
        },
    });
    const ops = [before, ...constraints, after];
    return base(ops, args);
};