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
import {noop} from 'utility/memory';
import {isEqual} from '../../utility/object';

export const createOperation = handlers => ({
    onBeginResize: noop,
    onResize: noop,
    onEndResize: noop,
    ...handlers,
});

export const resize = resizable => createOperation({
    onBeginResize: (e, shared) => {
        const {left, top, width, height} = resizable.current.getBoundingClientRect();
        shared.next = {left, top, width, height};
        shared.initial = {left, top, width, height};
    },
    onResize: ({delta}, shared)=> {
        const {left, top, width, height} = shared.initial;
        shared.next = {
            width: Math.max(width + delta.width, 0),
            height: Math.max(height + delta.height, 0),
            left: left + delta.left,
            top: top + delta.top,
        };
    },
});

export const lock = () => createOperation({
    onResize: ({delta}, shared) => {
        const {next, initial} = shared;
        // Ensure that the resize operation only affects the resized edge.
        // For example, when using the left resizer, it shouldn't go past the right edge,
        // and vice versa.
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
    },
})

/**
 * Limit the resizing of the element to not overflow the boundaries of the given container.
 *
 * @param container {ReactRef}
 * @return {{onResize: function, onBeginResize: function, onEndResize: function, dependencies: []}}
 */
export const contain = container => createOperation({
    onBeginResize: (e, shared) => {
        shared.max = container.current.getBoundingClientRect();
    },
    onResize: ({delta}, shared) => {
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
export const min = (minWidth, minHeight) => createOperation({
    onResize: (e, shared) => {
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
export const max = (maxWidth, maxHeight) => createOperation({
    onResize: (e, shared) => {
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
export const snap = (horizontal, vertical, strength = 1) => createOperation({
    onResize: (e, shared) => {
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
export const ratio = r => createOperation({
    onResize: (e, {next}) => {
        if (next.width / next.height > r) {
            next.height = next.width / r;
        } else {
            next.width = next.height * r;
        }
    },
});

/**
 * Call the function given in callback, passing shared.next as an argument.
 *
 * @param onUpdate
 * @returns {operation}
 */
export const update = onUpdate => createOperation({
    onBeginResize: _update(onUpdate),
    onResize: _update(onUpdate),
    onEndResize: _update(onUpdate),
});
const _update = onUpdate => (e, shared) => {
    if (!isEqual(shared.prev, shared.next)) {
        onUpdate(shared.next);
        shared.prev = shared.next;
    }
};

export const relative = ref => createOperation({
    onBeginResize: (e, shared) => {
        const reference = ref.current.getBoundingClientRect();
        shared.reference = reference;
        shared.next = {
            ...shared.next,
            left: shared.next.left - reference.left,
            top: shared.next.top - reference.top,
        };
    },
    onResize: (e, shared) => {
        const {reference, next} = shared;
        shared.next = {
            ...shared.next,
            left: next.left - reference.left,
            top: next.top - reference.top,
        };
    },
});