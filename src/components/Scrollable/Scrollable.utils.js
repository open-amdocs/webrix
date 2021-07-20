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

import {MIN_THUMB_LENGTH} from './Scrollable.constants';

/**
 * Compute the thumb length based on the given track and scroll lengths
 *
 * @param trackLength {number} The track length
 * @param clientLength {number} The scrollable container's client length (clientWidth/clientHeight)
 * @param scrollLength {number} The scrollable container's scroll length (scrollWidth/scrollHeight)
 * @param minLength {number} The min length of the thumb in pixels
 * @return {number} The thumb length
 */
export const getThumbLength = (trackLength, clientLength, scrollLength, minLength = MIN_THUMB_LENGTH) => {
    console.warn('Scrollable.getThumbLength() is deprecated. Use the CSS API instead. See https://webrix.amdocs.com/docs/components/scrollable#examples-css-custom-properties');
    const length = Math.round((clientLength / scrollLength) * trackLength);
    return Math.max(minLength, length);
};

/**
 * Compute the thumb position based on the given track and scroll lengths
 *
 * @param trackLength {number} The track length
 * @param clientLength {number} The scrollable container's client length (clientWidth/clientHeight)
 * @param scrollLength {number} The scrollable container's scroll length (scrollWidth/scrollHeight)
 * @param scrollPos {number} The scrollable container's scroll position (scrollTop/scrollWidth)
 * @param minLength {number} The min length of the thumb in pixels
 * @return {number} The thumb position
 */
export const getThumbPosition = (trackLength, clientLength, scrollLength, scrollPos, minLength = MIN_THUMB_LENGTH) => {
    const length = getThumbLength(trackLength, clientLength, scrollLength, minLength);
    const ratio = (trackLength - length) / (scrollLength - clientLength);
    return Math.round(scrollPos * ratio);
};
