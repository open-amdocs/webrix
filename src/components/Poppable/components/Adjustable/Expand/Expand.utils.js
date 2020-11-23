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

import {or, getCurrentRect} from '../Adjustable.utils';

const getMinimizedDimensions = sizes => ({width: sizes.minWidth, height: sizes.minHeight});

const getMaximizedDimensions = (cbr, sizes) => {
    // viewport width/height
    const vw = cbr.left + cbr.width;
    const vh = cbr.top + cbr.height;
    return ({
        vw, vh,
        width: Math.min(vw, or(sizes.maxWidth, Infinity)),
        height: Math.min(vh, or(sizes.maxHeight, Infinity)),
    });
};

const getPosWithinViewport = (current, length, view) => {
    // right/bottom out of viewport
    if (current + length > view) {
        return view - length;
    // left/top out of viewport
    } else if (current < 0) {
        return 0;
    }
    return current;
};

export const expandPopover = (br, tbr, cbr, sizes, setBoundingRect) => {
    const {vw, vh, width, height} = getMaximizedDimensions(cbr, sizes);
    setBoundingRect({
        ...br, width, height,
        top: getPosWithinViewport(or(br.top, tbr.top), height, vh),
        left: getPosWithinViewport(or(br.left, tbr.left), width, vw),
    });
};

export const minimizePopover = (br, tbr, sizes, setBoundingRect) => {
    const {top, left} = getCurrentRect(br, tbr);
    const {width, height} = getMinimizedDimensions(sizes);
    setBoundingRect({
        width, height,
        top: Math.max(0, top), left: Math.max(0, left),
    });
};

export const isExpanded = (br, tbr, cbr, sizes) => {
    const current = getCurrentRect(br, tbr);
    const {width, height} = getMaximizedDimensions(cbr, sizes);
    return current.width >= width && current.height >= height;
};

export const isDisabled = (expanded, br, tbr, cbr, sizes) => {
    const current = getCurrentRect(br, tbr);
    const maxLimit = getMaximizedDimensions(cbr, sizes);
    const minLimit = getMinimizedDimensions(sizes);
    return expanded
        ? current.width <= minLimit.width && current.height <= minLimit.height
        : current.width >= maxLimit.width && current.height >= maxLimit.height;
};
