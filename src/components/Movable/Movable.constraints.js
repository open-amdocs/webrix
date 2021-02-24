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
import {operation} from './Movable.hooks';

/**
 * Limit the movement to the given container.
 *
 * @param container {ReactRef} A ref to the container element.
 * @return {constraint}
 */
export const contain = container => operation({
    dependencies: [container],
    onBeginMove: (e, {ref}, shared) => {
        const {width, height} = ref.current.getBoundingClientRect();
        shared.bounds = container.current.getBoundingClientRect();
        shared.size = {width, height};
    },
    onMove: (e, args, shared) => {
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
 * @return {constraint}
 */
export const snap = (horizontal, vertical, strength = 1) => operation({
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

/**
 * Apply padding to the movement boundaries.
 * This can either be the bounds specified by the contain() constraints,
 * or, if using the useMoveArea() hook, the bounding rect of the given ref.
 *
 * @param top {number}
 * @param right {number}
 * @param bottom {number}
 * @param left {number}
 * @return {constraint}
 */
export const padding = (top, right, bottom, left) => operation({
    dependencies: [top, right, bottom, left],
    onBeginMove: (e, args, shared) => {
        shared.bounds = {
            top: shared.bounds.top + top,
            right: shared.bounds.right - right,
            bottom: shared.bounds.bottom - bottom,
            left: shared.bounds.left + left,
        };
    },
});