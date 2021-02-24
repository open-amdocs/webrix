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
    onBeginResize: noop,
    onResize: noop,
    onEndResize: noop,
    ...props,
})

export const contain = container => controller({
    dependencies: [container],
    onBeginResize: (e, args, shared) => {
        shared.max = container.current.getBoundingClientRect();
    },
    onResize: ({delta}, args, shared) => {
        const {initial, next, max} = shared;
        const width = clamp(next.width, 0, delta.left === 0 ? max.left + max.width - initial.left : initial.left + initial.width - max.left);
        const height = clamp(next.height, 0, delta.top === 0 ? max.top + max.height - initial.top : initial.top + initial.height - max.top);
        shared.next = {
            left: max.left + width,
            top: max.top + height,
            width, height,
        };
    },
});

export const min = (minWidth, minHeight) => controller({
    dependencies: [minWidth, minHeight],
    onResize: (e, args, shared) => {
        const {width, height} = shared.next;
        shared.next = {
            ...shared.next,
            width: Math.max(width, minWidth),
            height: Math.max(height, minHeight),
        };
    },
});

export const max = (maxWidth, maxHeight) => controller({
    dependencies: [maxWidth, maxHeight],
    onResize: (e, args, shared) => {
        const {width, height} = shared.next;
        shared.next = {
            ...shared.next,
            width: Math.min(width, maxWidth),
            height: Math.min(height, maxHeight),
        };
    },
});

export const snap = (horizontal, vertical, strength = 1) => controller({
    dependencies: [horizontal, vertical, strength],
    onResize: (e, args, shared) => {
        const {width, height} = shared.next;
        const rw =  Math.round(width / horizontal) * horizontal; // Rounded width
        const rh =  Math.round(height / vertical) * vertical; // Rounded height
        const hd = Math.abs(width - rw); // Distance of width from snap point
        const vd = Math.abs(height - rh); // Distance of height from snap point
        shared.next = {
            ...shared.next,
            // Apply rounded width/height only if distance is within the strength threshold
            width: hd <= strength * horizontal / 2 ? rw : width,
            height: vd <= strength * vertical / 2 ? rh : height,
        };
    },
});

export const ratio = r => controller({
    dependencies: [r],
    onResize: (e, args, {next}) => {
        if (next.width / next.height > r) {
            next.height = next.width / r;
        } else {
            next.width = next.height * r;
        }
    },
});