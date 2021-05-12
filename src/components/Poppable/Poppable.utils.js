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

import cls from 'classnames';
import {getRelativePosition} from 'utility/rect';
import {getBoundingRects as _getBoundingRects} from 'hooks/useBoundingRectObserver/useBoundingRectObserver';

/**
 * Get the bounding rects of the given elements.
 *
 * @param target
 * @param reference
 * @param container
 * @returns {{cbr: *, rbr: *, tbr: *, wbr: *}}
 */
export const getBoundingRects = (target, reference, container, placement) => {
    const [rbr, tbr, cbr] = _getBoundingRects([reference, target, container]);
    return {
        rbr: rbr || new DOMRect(), // Could be undefined initially, before the reference exists
        cbr: cbr || new DOMRect(),
        tbr: new DOMRect(placement.left, placement.top, tbr?.width, tbr?.height),
    };
};

/**
 * Get the cardinal directions of the target in relation to the reference.
 * The directions are calculated by comparing the center points of the two rects.
 * For example, if the center point of the reference is directly above the center
 * point of the target, the target will receive a 'south' class, since it is south
 * of the reference.
 *
 * @param {Object} tbr Target Bounding Rect
 * @param {Object} rbr Reference Bounding Rect
 * @returns string with locations
 */
export const getCardinalPosition = (tbr, rbr) => getRelativePosition(tbr, rbr).reduce((acc, cur, i) => (
    acc + (acc.length ? ' ' : '') + [
        ['west', '', 'east'],
        ['north', '', 'south'],
    ][i][cur + 1]
), '');

/**
 *
 * @param tbr
 * @param rbr
 * @returns {string}
 */
export const getClassNames = (tbr, rbr) => (
    cls(getCardinalPosition(tbr, rbr), {
        vbefore: tbr.bottom < rbr.top,
        vafter: rbr.bottom < tbr.top,
        hbefore: tbr.right < rbr.left,
        hafter: rbr.right < tbr.left,
    })
);