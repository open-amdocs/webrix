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
 * Returns a range representing the intersection between 2 ranges, if such exists.
 * Returns an empty array otherwise.
 *
 * @example
 * intersection([0, 10], [5, 15]); // [5, 10]
 * intersection([0, 10], [20, 30]); // []
 *
 * @param {Range} a The first range
 * @param {Range} b The second range
 * @returns {Range|Array} The intersection range
 */
export const intersection = (a, b) => {
    if (a[0] > b[1] || a[1] < b[0]) {
        return [];
    }
    return [Math.max(a[0], b[0]), Math.min(a[1], b[1])];
};

/**
 * Returns the midpoint of a given range.
 *
 * @example
 * midpoint([10, 20]); // 15
 *
 * @param from
 * @param to
 * @returns {number}
 */
export const midpoint = ([from, to]) => (from + to) / 2;

/**
 * Check whether the given number is within the range starting at `start` and ending at `end`, inclusive.
 *
 * @example
 * inRange(5, 0, 10); // True
 * inRange(0, 0, 10); // True
 * inRange(10, 0, 10); // True
 * inRange(11, 0, 10); // False
 *
 * @param {number} number The number to check
 * @param {number} start The lower boundary of the range
 * @param {number} end The upper boundary of the range
 * @return {boolean}
 */
export const inRange = (number, start, end) => number >= Math.min(start, end) && number <= Math.max(start, end);