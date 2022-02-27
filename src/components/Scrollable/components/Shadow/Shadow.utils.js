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

import {SHADOW_COLOR, SHADOW_SPREAD, SHADOW_THRESHOLD} from './Shadow.constants';

/**
 * Computes the shadow coefficient based on the scroll position.
 * The coefficient is a numerical value between 0 and 1, used to create the affect of a
 * growing shadow as we scroll.
 * The bigger the scroll value is, the bigger the coefficient is, up to SHADOW_THRESHOLD.
 * A scroll bigger than SHADOW_THRESHOLD will always return 1.
 *
 * @param scroll
 * @return {number}
 */
export const getShadowCoefficient = scroll => {
    return (Math.min(scroll, SHADOW_THRESHOLD) / SHADOW_THRESHOLD);
}

/**
 * Compute the value for the box-shadow CSS rule, based on the given scroll event.
 */
export const getBoxShadow = ({scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth}) => {
    const ts = getShadowCoefficient(scrollTop) * SHADOW_SPREAD;
    const ls = getShadowCoefficient(scrollLeft) * SHADOW_SPREAD;
    const bs = getShadowCoefficient(scrollHeight - scrollTop - clientHeight) * SHADOW_SPREAD;
    const rs = getShadowCoefficient(scrollWidth - scrollLeft - clientWidth) * SHADOW_SPREAD;
    const c = `var(--shadow-color, ${SHADOW_COLOR})`;

    // For each orientation create a double-layered shadow based on the shadow coefficient
    return (
        `inset 0 ${ts / 2}px ${ts / 4}px ${-ts / 4}px ${c}, inset 0 ${ts * 2}px ${ts}px ${-ts}px ${c},` + // Top shadow
        `inset ${ls / 2}px 0 ${ls / 4}px ${-ls / 4}px ${c}, inset ${ls * 2}px 0 ${ls}px ${-ls}px ${c},` + // Left shadow
        `inset 0 -${bs / 2}px ${bs / 4}px ${-bs / 4}px ${c}, inset 0 -${bs * 2}px ${bs}px ${-bs}px ${c},` + // Bottom shadow
        `inset -${rs / 2}px 0 ${rs / 4}px ${-rs / 4}px ${c}, inset -${rs * 2}px 0 ${rs}px ${-rs}px ${c}` // Right shadow
    );
}