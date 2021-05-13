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
import {isEqual} from 'utility/object';

export const createOperation = handlers => ({
    onBeginMove: noop,
    onMove: noop,
    onEndMove: noop,
    ...handlers,
});

/**
 * Use the Movable component given in ref as a movable object.
 *
 * @param movable
 * @returns {operation}
 */
export const move = movable => createOperation({
    onBeginMove: (e, shared) => {
        const {top, left} = movable.current.getBoundingClientRect();
        shared.next = {top, left};
        shared.initial = {top, left};
    },
    onMove: ({dx, dy}, shared)=> {
        const {left, top} = shared.initial;
        shared.next = {
            left: left + dx,
            top: top + dy,
        };
    },
});

/**
 * Use the Movable component given in ref as a trackpad, rather than a movable object.
 *
 * @param ref
 * @returns {operation}
 */
export const trackpad = ref => createOperation({
    onBeginMove: ({x, y}, shared) => {
        shared.initial = ref.current.getBoundingClientRect();
        shared.next = {left: x - shared.initial.left, top: y - shared.initial.top};
        shared.bounds = {top: 0, left: 0, right: shared.initial.width, bottom: shared.initial.height};
    },
    onMove: ({x, y}, shared) => {
        const {bounds, initial} = shared;
        shared.next = {
            left: clamp(x - initial.left, bounds.left, bounds.right),
            top: clamp(y - initial.top, bounds.top, bounds.bottom),
        };
    },
});

/**
 * Limit the movement to the given container.
 *
 * @param container {ReactRef} A ref to the container element.
 * @return {operation}
 */
export const contain = (movable, container) => createOperation({
    onBeginMove: (e, shared) => {
        const {width, height} = movable.current.getBoundingClientRect();
        shared.bounds = container.current.getBoundingClientRect();
        shared.size = {width, height};
    },
    onMove: (e, shared) => {
        const {bounds, next, size} = shared;
        shared.next = {
            left: clamp(next.left, bounds.left, bounds.right - size.width),
            top: clamp(next.top, bounds.top, bounds.bottom - size.height),
        };
    },
});

/**
 * Snap the movement to a grid specified by the given horizontal & vertical sizes
 * of the grid steps, optionally specifying the snapping strength.
 *
 * @param horizontal {number} The horizontal grid step size
 * @param vertical {number} The vertical grid step size
 * @param strength {number} The snap strength, where 1 is
 * @return {operation}
 */
export const snap = (horizontal, vertical, strength = 1) => createOperation({
    onMove: (e, shared) => {
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

/**
 * Transform the value in shared.next by applying the given transformers
 *
 * @param t
 * @returns {operation}
 */
export const transform = (...t) => createOperation({
    onBeginMove: (e, shared) => shared.next = t.reduce((acc, cur) => cur(acc), shared.next),
    onMove: (e, shared) => shared.next = t.reduce((acc, cur) => cur(acc), shared.next),
});

/**
 * Call the function given in callback, passing shared.next as an argument.
 * The callback will only be called if shared.next has changed since the last
 * call.
 *
 * @param onUpdate
 * @returns {operation}
 */
export const update = onUpdate => createOperation({
    onBeginMove: _update(onUpdate),
    onMove: _update(onUpdate),
    onEndMove: _update(onUpdate),
});
const _update = onUpdate => (e, shared) => {
    if (!isEqual(shared.prev, shared.next)) {
        onUpdate(shared.next);
        shared.prev = shared.next;
    }
};

export const relative = ref => createOperation({
    onBeginMove: (e, shared) => {
        const reference = ref.current.getBoundingClientRect();
        shared.reference = reference;
        shared.next = {
            left: shared.next.left - reference.left,
            top: shared.next.top - reference.top,
        };
    },
    onMove: (e, shared) => {
        const {reference, next} = shared;
        shared.next = {
            left: next.left - reference.left,
            top: next.top - reference.top,
        };
    },
});