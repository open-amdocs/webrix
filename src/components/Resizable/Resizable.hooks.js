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
import {toCSS} from 'utility/rect';

export const operation = props => ({
    dependencies: [],
    onBeginResize: noop,
    onResize: noop,
    onEndResize: noop,
    ...props,
});

// The base hook
export const base = (ops = [], args) => {
    const shared = useRef({});
    const dependencies = ops.reduce((acc, cur) => acc.concat(cur.dependencies), []).concat(Object.values(args));

    const onBeginResize = useCallback(e => {
        ops.forEach(({onBeginResize}) => onBeginResize(e, args, shared.current));
    }, dependencies);

    const onResize = useCallback(e => {
        ops.forEach(({onResize}) => onResize(e, args, shared.current));
    }, dependencies);

    const onEndResize = useCallback(e => {
        ops.forEach(({onEndResize}) => onEndResize(e, args, shared.current));
    }, dependencies);

    return {onBeginResize, onResize, onEndResize};
};

export const useResize = ({constraints = [], ...args}) => {
    const before = operation({
        onBeginResize: (e, {ref}, shared) => {
            const {left, top, width, height} = ref.current.getBoundingClientRect();
            shared.next = {left, top, width, height};
            shared.initial = {left, top, width, height};
        },
        onResize: ({delta}, args, {next, initial})=> {
            const {left, top, width, height} = initial;
            next.width = Math.max(width + delta.width, 0);
            next.height = Math.max(height + delta.height, 0);
            next.left = left + delta.left;
            next.top = top + delta.top;
        },
    });
    const after = operation({
        onResize: ({delta}, {onResize}, shared) => {
            const {next, initial} = shared;

            if (delta.left !== 0) {
                next.left = initial.left + initial.width - next.width;
            } else {
                next.left = initial.left;
            }
            if (delta.top !== 0) {
                next.top = initial.top + initial.height - next.height;
            } else {
                next.top = initial.top;
            }
            onResize(toCSS(next));
        },
    });
    const ops = [before, ...constraints, after];
    return base(ops, args);
};