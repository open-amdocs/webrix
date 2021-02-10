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

import {noop} from 'utility/memory';
import {clamp} from 'utility/number';

const controller = props => ({
    dependencies: [],
    onBeginMove: noop,
    onMove: noop,
    onEndMove: noop,
    ...props,
})

export const init = () => controller({
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

export const update = () => controller({
    onMove: (e, {onMove}, {next}) => {
        onMove({
            top: Math.round(next.top),
            left: Math.round(next.left),
        });
    },
});

export const contain = container => controller({
    dependencies: [container],
    onBeginMove: (e, {ref}, shared) => {
        const {width, height} = ref.current.getBoundingClientRect();
        shared.bounds = container.current.getBoundingClientRect();
        shared.size = {width, height};
    },
    onMove: (e, args, shared) => {
        const {bounds, next} = shared;
        shared.next = {
            left: clamp(next.left, bounds.left, bounds.right - shared.size.width),
            top: clamp(next.top, bounds.top, bounds.bottom - shared.size.height),
        };
    },
});

export const snap = (horizontal, vertical, strength = 1) => controller({
    dependencies: [horizontal, vertical, strength],
    onMove: (e, args, shared) => {
        const {top, left} = shared.next;
        const rl =  Math.round(left / horizontal) * horizontal; // Rounded left
        const rt =  Math.round(top / vertical) * vertical; // Rounded top
        const hd = Math.abs(left - rl); // Distance of left from snap point
        const vd = Math.abs(top - rt); // Distance of top from snap point
        shared.next = {
            // Apply rounded left/top only if distance is within the strength threshold
            left: hd <= strength * horizontal / 2 ? rl : left,
            top: vd <= strength * vertical / 2 ? rt : top,
        };
    },
});
