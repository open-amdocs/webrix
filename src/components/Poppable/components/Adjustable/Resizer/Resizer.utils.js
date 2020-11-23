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

const addNextRect = (current, delta) => ({
    top: current.top + delta.top,
    left: current.left + delta.left,
    width: current.width + delta.width,
    height: current.height + delta.height,
});

const getVerticalDimensions = (delta, current, next, sizes) => {
    let nextTop = next.top, nextHeight = next.height;
    // exceeds min limit
    const minVLimit = sizes.minHeight;
    if (next.height <= minVLimit) {
        nextTop = current.top + current.height - minVLimit;
        nextHeight = minVLimit;
    // exceeds max limit
    } else if (sizes.maxHeight && next.height >= sizes.maxHeight) {
        nextTop = current.top + current.height - sizes.maxHeight;
        nextHeight = sizes.maxHeight;
    }
    return ({
        top: delta.top ? nextTop : current.top,
        height: delta.height ? nextHeight : current.height,
    });
};

const getHorizontalDimensions = (delta, current, next, sizes) => {
    let nextLeft = next.left, nextWidth = next.width;
    // exceeds min limit
    const minHLimit = sizes.minWidth;
    if (next.width <= minHLimit) {
        nextLeft = current.left + current.width - minHLimit;
        nextWidth = minHLimit;
    // exceeds max limit
    } else if (sizes.maxWidth && next.width >= sizes.maxWidth) {
        nextLeft = current.left + current.width - sizes.maxWidth;
        nextWidth = sizes.maxWidth;
    }
    return ({
        left: delta.left ? nextLeft : current.left,
        width: delta.width ? nextWidth : current.width,
    });
};

export const getRectWithinLimitsRange = (delta, current, sizes) => {
    const next = addNextRect(current, delta);
    return ({
        ...getVerticalDimensions(delta, current, next, sizes),
        ...getHorizontalDimensions(delta, current, next, sizes),
    });
};
