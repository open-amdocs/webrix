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
import {clamp} from 'utility/number';

export const operation = props => ({
    dependencies: [],
    onBeginMove: noop,
    onMove: noop,
    onEndMove: noop,
    ...props,
});

// The base hook
export const useBase = (ops = [], args) => {
    const shared = useRef({});
    const dependencies = ops.reduce((acc, cur) => acc.concat(cur.dependencies), []).concat(Object.values(args));

    const onBeginMove = useCallback(e => {
        ops.forEach(({onBeginMove}) => onBeginMove(e, args, shared.current));
    }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

    const onMove = useCallback(e => {
        ops.forEach(({onMove}) => onMove(e, args, shared.current));
    }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

    const onEndMove = useCallback(e => {
        ops.forEach(({onEndMove}) => onEndMove(e, args, shared.current))
    }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

    return {onBeginMove, onMove, onEndMove, ref: args.ref};
};

export const useNewMove = (...ops) => {
    return useBase(ops, {});
};
/**
 * Generate the set of props to be injected to a Movable component,
 * applying the given constraints.
 *
 * @param constraints {array}
 * @param args
 * @return {{ref, onEndMove: function, onMove: function, onBeginMove: function}}
 */
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
    return useBase(ops, args);
};

/**
 * Generate the set of props to be injected to a Movable component,
 * applying the given constraints. This is similar to useMove(),
 * only here the ref is used as a movement 'pad', and the movement
 * is usually applied to another element.
 *
 * @param constraints {array}
 * @param args
 * @return {{ref, onEndMove: function, onMove: function, onBeginMove: function}}
 */
export const useMoveArea = ({constraints = [], ...args}) => {
    const before = operation({
        onBeginMove: ({x, y}, {ref, onMove}, shared) => {
            shared.initial = ref.current.getBoundingClientRect();
            shared.next = {left: x - shared.initial.left, top: y - shared.initial.top};
            shared.bounds = {top: 0, left: 0, right: shared.initial.width, bottom: shared.initial.height};
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
        onMove: (e, {onMove}, {next, bounds}) => {
            next.left = clamp(next.left, bounds.left, bounds.right);
            next.top = clamp(next.top, bounds.top, bounds.bottom);

            onMove({
                top: Math.round(next.top),
                left: Math.round(next.left),
            });
        },
    });
    const ops = [before, ...constraints, after];
    return useBase(ops, args);
};