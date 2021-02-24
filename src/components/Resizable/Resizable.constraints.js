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

import {clamp} from 'utility/number';
import {operation} from './Resizable.hooks';

/**
 * Limit the resizing of the element to not overflow the boundaries of the given container.
 *
 * @param container {ReactRef}
 * @return {{onResize: function, onBeginResize: function, onEndResize: function, dependencies: []}}
 */
export const contain = container => operation({
    dependencies: [container],
    onBeginResize: (e, args, shared) => {
        shared.max = container.current.getBoundingClientRect();
    },
    onResize: ({delta}, args, shared) => {
        const {initial, next, max} = shared;
        // The new width/height is dependent on which edge was used for resizing.
        // For example, when resizing using the left resizer, the right boundary is not the right side
        // of the container, but the right side of the resizable element. However, when resizing using
        // the right resizer, the right boundary becomes the right side of the container, and the left
        // boundary becomes the left side of the resizable element.
        const width = clamp(next.width, 0, delta.left === 0 ? max.left + max.width - initial.left : initial.left + initial.width - max.left);
        const height = clamp(next.height, 0, delta.top === 0 ? max.top + max.height - initial.top : initial.top + initial.height - max.top);
        shared.next = {
            left: max.left + width,
            top: max.top + height,
            width, height,
        };
    },
});

/**
 * Limit the resizing to not go below the given width/height.
 *
 * @param minWidth {number}
 * @param minHeight {number}
 * @return {{onResize: function, onBeginResize: function, onEndResize: function, dependencies: []}}
 */
export const min = (minWidth, minHeight) => operation({
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

/**
 * Limit the resizing to not go above the given width/height.
 *
 * @param maxWidth {number}
 * @param maxHeight {number}
 * @return {{onResize: function, onBeginResize: function, onEndResize: function, dependencies: []}}
 */
export const max = (maxWidth, maxHeight) => operation({
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

/**
 * Snap the resizing to a grid specified by the given `horizontal` & `vertical` arguments,
 * optionally specifying the snapping strength in `strength`, as a number between `0` and `1`.
 *
 * @param horizontal {number}
 * @param vertical {number}
 * @param strength {number}
 * @return {{onResize: function, onBeginResize: function, onEndResize: function, dependencies: []}}
 */
export const snap = (horizontal, vertical, strength = 1) => operation({
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

/**
 * Maintain the given ratio when resizing. The given value represents the ratio between the width
 * and the height. For example, to maintain a `4:3` ratio, use the value `4/3`.
 *
 * @param r {number}
 * @return {{onResize: function, onBeginResize: function, onEndResize: function, dependencies: []}}
 */
export const ratio = r => operation({
    dependencies: [r],
    onResize: (e, args, {next}) => {
        if (next.width / next.height > r) {
            next.height = next.width / r;
        } else {
            next.width = next.height * r;
        }
    },
});