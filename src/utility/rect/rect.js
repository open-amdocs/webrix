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

/**
 * Get the center point of a DOMRect
 *
 * @example
 * const rect = new DOMRect(0, 0, 100, 100);
 * getCenterPoint(rect); // Returns [50, 50]
 *
 * @param rect {DOMRect} The DOMRect for which to get the center point
 * @return {Array} A 2 element array representing the x/y coordinates of the center point
 */
export const getCenterPoint = rect => [rect.left + rect.width/2, rect.top + rect.height/2];

/**
 * Get the horizontal/vertical position of rect b in relation to rect a.
 * This function returns a 2 element array representing the relations between the rects.
 * The first element represents the horizontal relation, and the second element represents
 * the vertical relation. The relations are defined as a numeric value, one of -1, 0 or 1,
 * representing whether the target rect is before, on, or after the reference rect for a given
 * orientation.
 *
 * @example
 * const a = new DOMRect(0, 0, 20, 20);
 * const b = new DOMRect(20, 20, 20, 20); // This rect is below and to the right of rect a
 * getRelativePosition(a, b) // Returns [-1, -1]
 *
 * @param a {DOMRect} The rect to use as a reference
 * @param b {DOMRect} The rect to check against the reference
 * @return {Array} A 2 element array representing the vertical/horizontal position of rect b relative to rect a
 */
export const getRelativePosition = (a, b) => {
    const ca = getCenterPoint(a);
    const cb = getCenterPoint(b);
    const hd = ca[0] - cb[0]; // Horizontal diff
    const vd = ca[1] - cb[1]; // Vertical diff

    return [hd ? hd/Math.abs(hd) : hd , vd ? vd/Math.abs(vd) : vd];
};

/**
 * Compare two DOMRects to check if they match in size and position.
 *
 * @example
 * const a = new DOMRect(0, 0, 20, 20);
 * const b = new DOMRect(0, 0, 20, 20);
 * equal(a, b) // Returns true
 *
 * @param a {DOMRect} The first rect
 * @param b {DOMRect} The second rect
 * @returns {boolean} True if both rects are equal in size and position, false otherwise
 */
export const equal = (a, b) => (
    ['top', 'left', 'width', 'height'].every(key => a[key] === b[key])
);

/**
 * Check whether the given target is contained within the given container.
 *
 * @example
 * const container = new DOMRect(0, 0, 20, 20);
 * const target = new DOMRect(5, 5, 10, 10);
 * contained(target, container) // Returns true
 *
 * @param target {DOMRect} The target rect
 * @param container {DOMRect} The container rect
 * @returns {boolean} True if the target is contained within the container
 */
export const contained = (target, container) => (
    target.left >= container.left
    && target.left + target.width <= container.left + container.width
    && target.top >= container.top
    && target.top + target.height <= container.top + container.height
);

/**
 * Check whether the given rects are intersecting.
 *
 * @example
 * const a = new DOMRect(0, 0, 20, 20);
 * const b = new DOMRect(5, 5, 10, 10);
 * intersects(a, b) // Returns true
 *
 * @param a {DOMRect} The first rect
 * @param b {DOMRect} The second rect
 * @return {boolean} True if a intersects b
 */
export const intersect = (a, b) => (
    b.right >= a.left
    && b.left <= a.right
    && b.top <= a.bottom
    && b.bottom >= a.top
);

/**
 * Get the DOMRect representing the intersecting area between the 2 given rects.
 *
 * @param a {DOMRect} The first rect
 * @param b {DOMRect} The second rect
 *
 * @return {DOMRect}
 */
export const union = (a, b) => {
    if (intersect(a, b)) {
        const left = Math.max(a.left, b.left);
        const top = Math.max(a.top, b.top);
        const right = Math.min(a.right, b.right);
        const bottom = Math.min(a.bottom, b.bottom);
        return new DOMRect(left, top, right - left, bottom - top);
    }
};

/**
 * Get the area of the given DOMRect
 *
 * @param rect {DOMRect}
 * @return {number}
 */
export const area = rect => rect.width * rect.height;

/**
 * Add the deltas given in 'delta' to the rectangle given in 'rect'
 *
 * @param rect {DOMRect} The rectangle to add to
 * @param delta {DOMRect} A rect representing the deltas to add to the rectangle
 * @return {DOMRect}
 */
export const add = (rect, delta) => new DOMRect(
    rect.left + delta.left,
    rect.top + delta.top,
    rect.width + delta.width,
    rect.height + delta.height,
);

/**
 * Converts a ResizeObserverEntry to an object with width/height,
 * unifying the different APIs between older/newer browsers, and mobile devices.
 *
 * @param entry
 * @returns {{width: number, height: number}|{width: *, height: *}}
 */
export const readResizeObserverEntry = entry => {
    if (entry.borderBoxSize) {
        // Firefox implements `borderBoxSize` as a single content rect, rather than an array
        const borderBoxSize = Array.isArray(entry.borderBoxSize) ? entry.borderBoxSize[0] : entry.borderBoxSize;
        const {inlineSize: width, blockSize: height} = borderBoxSize;
        return {width, height};
    } else {
        // For older browsers & mobile devices that don't support the newer `borderBoxSize`
        // Note that we could use entry.contentRect here, which has better performance,
        // but since it does not include the padding & borders we use getBoundingClientRect() instead.
        const {width, height} = entry.target.getBoundingClientRect();
        return {width, height};
    }
};
