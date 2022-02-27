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
import {decimals} from 'utility/number';

/**
 * This function normalizes the scroll position to a number between 0 and 1.
 * The precision of the returned value is relative to the difference between the scrollLength
 * and the clientLength.
 *
 * @param scrollLength
 * @param clientLength
 * @param scrollOffset
 * @returns {number}
 */
export const normalizeScrollPosition = (scrollLength, clientLength, scrollOffset) => {
    const diff = Math.max(1, scrollLength - clientLength); // Enforce a min value of 1 to avoid division by 0
    const normalized = Math.min(1, scrollOffset / diff); // Avoid a ratio greater than 1
    // The returned value number of decimals is based on the number of digits in 'diff'.
    // For example, if normalized = 0.123456 and diff = 100, then the returned
    // value will be 0.123 (since diff has 3 digits). This is done to avoid have over precised
    // numbers, which may cause the scrollbars to be glitchy.
    return decimals(normalized, Math.floor(Math.log10(diff)) + 1);
}