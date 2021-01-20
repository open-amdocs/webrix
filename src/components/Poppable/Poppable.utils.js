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
import {getType} from 'utility/types';
import {getRelativePosition} from 'utility/rect';

/**
 * Returns true if all the given refs have a non-falsy 'current' property
 *
 * @param refs
 * @returns {boolean}
 */
export const refsReady = (...refs) => refs.every(ref => ref instanceof DOMRect || ref.current);

/**
 * Get the bounding rects of the given elements.
 *
 * @param target
 * @param reference
 * @param container
 * @returns {{cbr: *, rbr: *, tbr: *, wbr: *}}
 */
export const getBoundingRects = (target, reference, container) => {
    const wbr = new DOMRect(0, 0, window.innerWidth, window.innerHeight);
    return ({
        tbr: target.current.getBoundingClientRect(),
        rbr: reference instanceof DOMRect ? reference : reference.current.getBoundingClientRect(),
        cbr: getType(container.current) === 'window' ? wbr : container.current.getBoundingClientRect(),
        wbr,
    });
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